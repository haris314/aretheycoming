from django.db import models
from datetime import datetime

from django.contrib.auth.models import User

# Create your models here.

#The group relation
class Group(models.Model):

    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    college = models.CharField(max_length=100, blank=True)
    graduation_year = models.IntegerField(blank=True)
    section = models.CharField(max_length=1, blank=True)
    batch = models.CharField(max_length=2, blank=True)

    date_created = models.DateTimeField(default=datetime.now, blank=True)

    admins = models.ManyToManyField(User, through='Membership')

    def __str__(self):
        return f"{self.name}"


#The Member of relation
class Membership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    date_joined = models.DateTimeField(default=datetime.now)
    admin = models.BooleanField(default=False)

    class meta:
        #make sure group and user are unique together
        unique_together = {'group', 'user'}


#The Request to join relation
class Request(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')

    request_date = models.DateTimeField(default=datetime.now)

    class meta:
        #make sure group and user are unique together
        unique_together = {'group', 'user'}