from django.urls import path
from . import views

urlpatterns = [
    path("", views.groups, name="groups"),
    path("<int:id>", views.group_details, name="group_details"),
    path("<int:id>/request", views.join_request, name="join_request"),
]
