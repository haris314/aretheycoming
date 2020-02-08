from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("feed/", views.feed, name="feed"),

    # To show the user their active events (AJAX request)
    path("feed/get_events", views.get_events, name="get_events"),
]
