from django.shortcuts import render

# Create your views here.

#index view to find groups
#Shows all groups and let's search for more specific groups
def groups(request):
    return render(request, "groups/groups.html")