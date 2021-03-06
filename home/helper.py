from .models import Group, Membership, Request, Vote, Event
import pytz
from datetime import datetime
from django import db

# Function to return whether the current user is admin of the given group or not
def is_admin(request, group):
    db.connections.close_all()

    # If the user is not logged in return false
    if(request.user.is_authenticated is False):
        db.connections.close_all()
        return False
    
    # Get Membership
    membership = Membership.objects.filter(group=group, user=request.user).first()

    # If User is not even a member, return false
    if(membership is None):
        db.connections.close_all()
        return False
    
    # Now check if the member is admin
    db.connections.close_all()
    return membership.admin;


# To check whether the given user is the member of the given group or not
def is_member(request, group):
    db.connections.close_all()

    # If not even logged in, return false
    if request.user.is_authenticated == False:
        db.connections.close_all()
        return False
    
    # Check
    for user in group.members.all():
        if request.user.username == user.username:
            db.connections.close_all()
            return True
    
    db.connections.close_all()
    return False

# Function to return JSON response from a list of (Group objects)s
def get_json_groups(group_list):
    db.connections.close_all()

    data = []

    # Add all the groups in the data from the list of (Group objects)s
    for groups in group_list:
        for group in groups:

            # Shrink description length of lengthy descriptions
            if len(group.description) > 68:
                group.description = group.description[0 : 66] + ". ."    
            
            # Add the group
            data.append({
                'name' : group.name,
                'id' : group.id,
                'membersCount' : group.members.count(),
                'description' : group.description,
    
                'college': group.college,
                'graduationYear': group.graduation_year,
                'section': group.section,
                'batch': group.batch,
            })   
    
    db.connections.close_all()
    return data


# Function to return JSON response from a list of events
def get_json_events(events_list):
    db.connections.close_all()

    data = []

    for event in events_list:
        votes = Vote.objects.filter(event=event).all()
        print(votes)
        # Dictionary to hold the count of votes
        vote_counts = {
            '1': 0,
            '2': 0,
            '3': 0,
        } 
        for vote in votes:
            vote_counts[str(vote.vote)] += 1
        
        data.append({
            'id': event.id,
            'name': event.name,
            'create_time': event.create_time,
            'creator': event.creator.username,
            'start_time': event.start_time,
            'end_time': event.end_time,
            'description': event.description,
            'group_id': event.group.id,
            'group_name': event.group.name,
            'yes': vote_counts['1'],
            'no': vote_counts['2'],
            'maybe': vote_counts['3'],
        })
    
    db.connections.close_all()
    return data


# To get the current timezone aware datetime UTC
def get_current_timezone_aware_datetime():
    db.connections.close_all()

    now = datetime.now() # Because I imported the datetime class and not the whole module
    timezone = pytz.timezone("UTC")
    now = timezone.localize(now)
    db.connections.close_all()
    return now;