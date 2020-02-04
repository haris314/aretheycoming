from django.contrib import admin
from .models import Group, Membership, Request, Event, Vote

# Register your models here.
admin.site.register(Group)
admin.site.register(Membership)
admin.site.register(Request)
admin.site.register(Event)
admin.site.register(Vote)