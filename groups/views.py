from django.shortcuts import render
from .models import Group, Membership, Request

# Create your views here.

#index view to find groups
#Shows all groups and let's search for more specific groups
def groups(request):

    #get groups
    groups = Group.objects.all()
    return render(request, "groups/groups.html", {"groups":groups})