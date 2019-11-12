from django.urls import path
from . import views

urlpatterns = [

    #To display all groups
    path("", views.groups, name="groups"),

    #To display the filtered groups (Only an AJAX request)
    path("filter", views.filter_groups, name="filter_groups"),

    #To show the details of a group
    path("<int:id>", views.group_details, name="group_details"),
    path("<int:id>/request", views.join_request, name="join_request"),
    
    #When someone accepts a join request
    path("<int:group_id>/accept", views.accept, name="accept"),

    #To create a new group
    path("create_group", views.create_group, name="create_group"),

    #To show the current user his/her groups
    path("my_groups", views.my_groups, name="my_groups"),
]
