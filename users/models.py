from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from groups.models import *

# Create your models here.
class User_profile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    
    def __str__(self):
        return f"{self.username.username} ({self.first_name} {self.last_name}) "