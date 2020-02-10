from django.urls import path
from . import views

urlpatterns = [

    # To display all groups
    path("", views.groups, name="groups"),

    # To display the filtered groups (Only an AJAX request)
    path("filter", views.filter_groups, name="filter_groups"),

    # To show the details of a group
    path("<int:id>", views.group_details, name="group_details"),
    path("<int:id>/request", views.join_request, name="join_request"),
    
    # When someone accepts/rejects a join request
    path("<int:group_id>/accept", views.accept, name="accept"),

    # When a group admin takes action on a group member
    path("member_action", views.member_action, name="member_action"),

    # When some user creates an event in a group
    path("<int:group_id>/create_event", views.create_event, name="create_event"),

    # For AJAX requests to get events of a group
    path("<int:group_id>/get_events", views.get_events, name="get_events"),

    # For AJAX request to leave a group
    path("<int:group_id>/leave_group", views.leave_group, name="leave_group"),

    # To create a new group
    path("create_group", views.create_group, name="create_group"),

    # To delete a group
    path("<int:group_id>/delete_group", views.delete_group, name="delete_group"),

    # To show the current user his/her groups
    path("my_groups", views.my_groups, name="my_groups"),


]
