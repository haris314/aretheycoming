from django.urls import path
from . import views

urlpatterns = [
    path("", views.login_view, name="login_view"),
    path("logout", views.logout_view, name="logout_view"),
    path("signup", views.sign_up, name="sign_up"),

    #for ajax request to check username validity
    path("check_ajax", views.check_username_ajax, name="check_username_ajax"),
]
