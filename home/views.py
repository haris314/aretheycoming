from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from .models import *
from groups.helper import get_json_events

# Create your views here.

# Displays home page if not logged in
# Sends to feed if logged in
def home(request):

    # If the user is already logged in, send to feed
    if(request.user.is_authenticated):
        return redirect('/feed')

    # Else show home page
    return render(request, 'home/home.html')


def feed(request):

    # If not logged in, send to login page
    if(not request.user.is_authenticated):
        return redirect('/login')
    
    # Else show feed
    return render(request, 'home/feed.html')


# Returns the active events for a user's feed (AJAX Request)
def get_events(request):

    # If the user is not even logged in
    if request.user.is_authenticated != True:
        return JsonResponse({'success': False})
    
    # Get all the events of the users
    events_to_send = []
    # First, we get the user's memberships
    memberships = Membership.objects.filter(user=request.user).all()
    print("Memberships")
    print(memberships)

    for membership in memberships:
        events = membership.group.events.order_by('-start_time').all()
        for event in events:
            events_to_send.append(event)
    
    events_to_send = get_json_events(events_to_send)
    return JsonResponse({'success': True, 'events': events_to_send})