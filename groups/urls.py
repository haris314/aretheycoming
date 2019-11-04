from django.urls import path
from . import views

urlpatterns = [
    path("", views.groups, name="groups"),
    path("<int:id>", views.group_details, name="group_details"),
    path("<int:id>/request", views.join_request, name="join_request"),
    
    #When someone accepts a join request
    path("<int:group_id>/accept", views.accept, name="accept"),

    #To create a new group
    path("create_group", views.create_group, name="create_group"),
]
