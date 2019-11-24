from django.shortcuts import render, redirect, reverse
from .models import Group, Membership, Request
from django.http import JsonResponse, HttpResponse
from .helper import *

#To see exception details
import sys

import time

# Create your views here.

#index view to find groups
#Shows all groups
def groups(request):

     #If the method is GET, this means just return the html page
    if request.method == 'GET':

        #get groups
        groups = Group.objects.order_by('-date_created').all()

        #Shrink description length of lengthy descriptions
        for group in groups:
            if len(group.description) > 68:
                group.description = group.description[0 : 66] + ". ."

        return render(request, "groups/groups.html", {"groups":groups})


    #If the method is POST, someone is asking for more groups
    if request.method == 'POST':

        #Get the form data
        start = int(request.POST['start'])
        count = int(request.POST['count'])


        groups = Group.objects.order_by('-id')[start: start+count];
        
        if(groups is None):
            pass

        data = get_json_groups([groups])

        #time.sleep(1)
        return JsonResponse(data, safe=False);


#To filter groups (Only AJAX request)
def filter_groups(request):

    #Housekeeping
    if(request.method != "POST"):
        return HttpResponse(status=404)

    #Get the filter keyword from the request
    keyword = request.POST['keyword']

    group_list = []

    #If it matches the id of some group
    try:
        id = int(keyword)
        groups = Group.objects.filter(id=id).all()
        group_list.append(groups)
    except:
        #If exception occurs, keyword is not a valid id candidate
        pass
    
    #Search the keyword in names
    groups = Group.objects.filter(name__icontains= f'{keyword}').all()
    print(groups.count())
    group_list.append(groups)

    return JsonResponse(get_json_groups(group_list), safe=False)



#Shows details of a specific group
def group_details(request, id):

        #get group
        group = Group.objects.get(id=id)

        #get the memberships in the group
        memberships = Membership.objects.filter(group=group).all()

        #get the requests to join the group
        requests = Request.objects.filter(group=group).all()

        #Get whether the user is admin of this group or not
        adminFlag = is_admin(request, group)

        #Create the context object
        context = {
            "group": group,
            "memberships": memberships,
            "requests": requests,
            "adminFlag": adminFlag,
        }
        return render(request, 'groups/group_details.html', context)




#When someone requests to join a group
def join_request(request, id):

    #Do not allow the user to send a join request without clicking on my button
    if(request.method != "POST"):
        return render(request, 'error.html', {"message": "You are not allowed to do this!"})

    #If user is not logged in
    if(not request.user.is_authenticated):
        return JsonResponse({'success': False, 'reason': "Not logged in"})

    #Get group
    group = Group.objects.get(id=id)

    #If request already exists
    exist = Request.objects.filter(group=group, user=request.user).first()
    if(exist is not None):
        return JsonResponse({'success': False, 'reason': "Already sent"})

    #If the user is already a member
    exist = group.members.filter(username=request.user.username).first()
    if(exist is not None):
        return JsonResponse({'success': False, 'reason': "Already a member"})
        
    #Process the request
    new_request = Request(group=group, user=request.user)
    new_request.save()

    return JsonResponse({'success': True})


#To accept/reject a join request
def accept(request, group_id):

    #If someone tries to access it via unfair means
    if request.method != "POST":
        return HttpResponse(status=404)
    
    #If user is not even logged in
    if not request.user.is_authenticated :
        return JsonResponse({'success': False})

    #Get group and user's membership
    group = Group.objects.get(id=group_id)
    membership = Membership.objects.filter(group=group, user=request.user).first()

    #If the given user is not admin of the group and still accesses it
    if membership.admin is False:
        return JsonResponse({'success':False})

    #If join request does not exist
    request_id = request.POST['request_id']
    join_request = Request.objects.filter(id = request_id).first()
    if join_request is None:
        return JsonResponse({'success': False})

    #Delete the join request from database if the action is 0. 0 means reject
    
    if request.POST['action'] == '0':
        join_request.delete()
    
    else:
        #Finally process the accept request
        #Make membership and delete join request
        membership = Membership(group=group, user=join_request.user, admin=False)
        membership.save()
        join_request.delete()

    #Return success
    return JsonResponse({'success': True})


#When a group admin takes action on a group member
def member_action(request):
    #If someone tries to access it via unfair means
    if request.method != "POST":
        return HttpResponse(status=404)
    
    #If user is not even logged in
    if not request.user.is_authenticated :
        return JsonResponse({'success': False})

    #Get membership
    membership = Membership.objects.filter(id=request.POST['membership_id']).first()

    #Get the membership of the user who took action
    actioner = Membership.objects.filter(user=request.user).first().admin

    # If membership id is invalid or 
    # the action taker is not an admin of the group to which the membership of the member belong to or
    # The user on whom the action was taken was hirself an admin
    if (membership is None) or (Membership.objects.filter(user=request.user, group=membership.group).first().admin is False) or (membership.admin):
        return JsonResponse({'success':False})

    #Take care of actions
    if request.POST['action'] == 'remove':
        membership.delete()
        return JsonResponse({'success': True})

    if request.POST['action'] == 'adminify':
        membership.admin = True;
        membership.save()
        return JsonResponse({'success': True})




#To create a new group
def create_group(request):

    #If the user is not logged in
    if request.user.is_authenticated is False:
        return render(request, 'error.html', {'message': "You are not logged in"})

    #If the method is get, just give the create group page
    if(request.method == "GET"):
        return render(request, 'groups/create_group.html')

    #If method is post, this means someone has submitted the form
    if(request.method == 'POST'):

        #Get the details
        name = request.POST['name']
        college = request.POST['college']
        graduation_year = request.POST['graduation_year']
        section = request.POST['section']
        batch = request.POST['batch']
        description = request.POST['description']

        #Because I treat the string "No description" as empty description :(
        if description is '':
            description = "No description"
        
        if graduation_year is '':
            graduation_year = None

        #Do the checks
        #Group name must not be empty
        if name is '':
            return render(request, 'error.html', {'message': "Empty group name"})
        
        #If batch or section is not empty then college and passing year must not be empty
        if (batch is not '') or (section is not ''):
            if (college is '') or (graduation_year is ''):
                return render(request, 'error.html', {'message': "If batch or section is not empty then college and passing year must not be empty"})
        
        #Section must be 1 character and batch must be at most 2 long
        if (len(section) > 1) or (len(batch) > 2):
            return render(request, 'error.html', {'message': "Section must be 1 character and batch must be at most 2 characters long"})
        
        #Name must be at most 50 chars
        if len(name) > 50:
            return render(request, 'error.html', {'message': "Name must be at most 50 chars"})

        #Finally do the insertion in the database
        try:
             #Make the group
            new_group = Group(name=name, description=description, college=college, graduation_year=graduation_year, section=section, batch=batch)
            new_group.save()

            #Make the current user the admin of this new group
            new_member = Membership(group=new_group, user=request.user, admin=True)
            new_member.save()

        except (Exception):
            print("Oops!", sys.exc_info()[0], "occurred.")
            return render(request, 'error.html', {'message': "Something went wrong. Are you sure you are putting the right details? If yes then please contact admin"})
        
        #Successfully added
        return render(request, 'success.html', {"message": "Successfully created new group"})


#To display the groups which the user is part of
def my_groups(request):

    #If the user is not logged in, redirect to login page
    if not request.user.is_authenticated:
        return redirect('/login')

    #Get groups and render
    #First we get the user's memberships
    memberships = Membership.objects.filter(user=request.user).all()

    #Filter them in appropriate lists
    admin_groups = []
    member_groups = []
    for membership in memberships:

        #Get the data
        group = membership.group
        to_append = {
            'id': group.id,
            'name': group.name,
            'members_count': group.members.count(),
        }

        #Add the group in the admin list if user is admin of this group else in member list
        if(membership.admin):
            admin_groups.append(to_append)
        else:
            member_groups.append(to_append)
    
    #Prepare the context and render
    context = {
        'admin_groups': admin_groups,
        'member_groups': member_groups,
    }
    return render(request, 'groups/my_groups.html', context)