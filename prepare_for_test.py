from groups.models import Group, Membership, Request
from django.contrib.auth import User


#Delete all members
members = Membership.objects.all()
for member in members:
    member.delete()

#Make fd, admin of group #11
user = User.objects.get(username=username)
group = Group.objects.get(id=11)
membership = Membership(user=user, group=group, admin=True)
membership.save()

#Make everyone but fd request to join group #11
users = User.objects.all()
for user in users:
    if user.username is 'fd':
        continue
    request = Request(user=user, group=group)
    request.save()