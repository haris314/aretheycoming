from django.shortcuts import render
from .models import Group, Membership, Request

# Create your views here.

#index view to find groups
#Shows all groups and let's search for more specific groups
def groups(request):

    #get groups
    groups = Group.objects.order_by('-date_created').all()

    #Shrink description length of lengthy descriptions
    for group in groups:
        if len(group.description) > 68:
            group.description = group.description[0 : 66] + ". ."

    return render(request, "groups/groups.html", {"groups":groups})


#Shows details of a specific group
#Let's admins accept people into the group
def group_details(request, id):

    #get group
    group = Group.objects.get(id=id)

    #get the members in the group
    members = group.members.all()

    #get the requests to join the group
    requests = Request.objects.filter(group=group).all()

    #Create teh context object
    context = {
        "group": group,
        "members": members,
        "requests": requests
    }
    return render(request, 'groups/group_details.html', context)


#Wehn someone requests to join a gorup
def join_request(request, id):
    group = Group.objects.get(id=id)

    new_request = Request(group=group, user=request.user)
    new_request.save()

    return render(request, 'error.html', {"message":"Join request sent"})
