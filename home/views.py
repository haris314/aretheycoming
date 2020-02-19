from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from .models import *
from home.helper import *

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

    events = Event.objects.none() # Empty query set
    for membership in memberships:
        events = events | membership.group.events.all() # Union

    # Sort all the events in ascending order by start_time
    events = events.order_by('start_time')
    for event in events:

        now = get_current_timezone_aware_datetime()
        if event.end_time > now: # Only add those events whose endtime is in future
            events_to_send.append(event)
        
    # Convert into JSON and add some other required fields
    events_to_send = get_json_events(events_to_send) 
    return JsonResponse({'success': True, 'events': events_to_send})