from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.login_view, name="login_view"),
    path("logout", views.logout_view, name="logout_view"),
    path("signup", views.sign_up, name="sign_up"),
]
