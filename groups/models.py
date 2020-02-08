from django.db import models
from datetime import datetime
from django.utils import timezone

from django.contrib.auth.models import User

# Create your models here.

#The group relation
class Group(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField(default="No description", blank=True)

    #college details
    college = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    section = models.CharField(max_length=1, blank=True, null=True)
    batch = models.CharField(max_length=2, blank=True, null=True)

    date_created = models.DateTimeField(default=datetime.now, blank=True)

    members = models.ManyToManyField(User, through='Membership')

    def __str__(self):
        return f"{self.id}. {self.name}"


#The Member of relation
class Membership(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')

    date_joined = models.DateTimeField(default=datetime.now)
    admin = models.BooleanField(default=False)
    
    class meta:
        #make sure group and user are unique together
        unique_together = {'group', 'user'}

    def __str__(self):
        return f"{self.id}. {self.user.username} joined {self.group.name}"


#The Request to join relation
class Request(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='requests', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests', blank=True, null=True)

    request_date = models.DateTimeField(default=datetime.now)

    class meta:
        #make sure group and user are unique together
        unique_together = {'group', 'user'}

    def __str__(self):
        return f"{self.id}. {self.user} requested to join {self.group}"


#The Event relation
class Event(models.Model):

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=50, null=False, blank=False) # Can't be null or blank

    create_time = models.DateTimeField(default=timezone.now(), null=False, blank=False) # Can't be null or blank
    creator = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_events')

    start_time = models.DateTimeField(null=False, blank=False) # Can't be null or blank
    end_time = models.DateTimeField(null=True, blank=True)

    description = models.TextField(null=True, blank=True)

    # Relation 'has' between Group and Event
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='events')

    # Relation 'Votes in' between User and Event
    voters = models.ManyToManyField(User, through='Vote')

    def __str__(self):
        return f"{self.name}({self.group.name}), id={self.id}"


# The Vote relation
class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='votes')

    vote = models.CharField(max_length=20)
    time = models.DateTimeField(default=datetime.now)
