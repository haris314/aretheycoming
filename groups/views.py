from django.shortcuts import render, redirect, reverse
from .models import Group, Membership, Request
from django.http import JsonResponse, HttpResponse
from .helper import *

import time

# Create your views here.

#index view to find groups
#Shows all groups and let's search for more specific groups
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

        print(f"{start} {count}")

        groups = Group.objects.order_by('-id')[start: start+count];
        
        if(groups is None):
            pass

        #Shrink description length of lengthy descriptions
        for group in groups:
            if len(group.description) > 68:
                group.description = group.description[0 : 66] + ". ."       
                    
        data = []
        for group in groups:
            data.append({
                'name' : group.name,
                'id' : group.id,
                'membersCount' : group.members.count(),
                'description' : group.description,
    
                'college': group.college,
                'graduationYear': group.graduation_year,
                'section': group.section,
                'batch': group.batch,
            })
        time.sleep(1)
        return JsonResponse(data, safe=False);


#Shows details of a specific group
#Let's admins accept people into the group
def group_details(request, id):

        #get group
        group = Group.objects.get(id=id)

        #get the members in the group
        members = group.members.all()

        #get the requests to join the group
        requests = Request.objects.filter(group=group).all()

        #Get whether the user is admin of this group or not
        adminFlag = is_admin(request, group)

        #Create teh context object
        context = {
            "group": group,
            "members": members,
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


#To accept a join request
def accept(request, group_id):
    print(1);

    #If someone tries to access it via unfair means
    if request.method != "POST":
        return JsonResponse({'success': False})
    print(1);
    

    #If user is not even logged in
    if not request.user.is_authenticated :
        return JsonResponse({'success': False})
    print(1);


    #Get group and user's membership
    group = Group.objects.get(id=group_id)
    membership = Membership.objects.filter(group=group, user=request.user).first()

    #If the given user is not admin of the group and still accesses it
    if membership.admin is False:
        return JsonResponse({'success':False})
    print(1);


    #If join request does not exist
    request_id = request.POST['request_id']
    join_request = Request.objects.filter(id = request_id).first()
    if join_request is None:
        return JsonResponse({'success': False})
    print(1);


    #Finally process the accept request
    #Make membership and delete join request
    membership = Membership(group=group, user=join_request.user, admin=False)
    membership.save()
    join_request.delete()

    #Return success
    return JsonResponse({'success': True})


    