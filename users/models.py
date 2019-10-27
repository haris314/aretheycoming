from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class User_profile(models.Model):
    username = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    reg_date_time = models.DateTimeField(default=datetime.now, blank=True)

    def checkCompatibility(self):
        self.username.username = self.username.username.lower()

    def __str__(self):
        return f"{self.username.username} ({self.first_name} {self.last_name}) "