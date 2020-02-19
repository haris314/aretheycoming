import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

from groups.models import Vote, Event

class EventConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({
            'type': 'websocket.accept'
        })



    async def websocket_receive(self, event):

        # Convert the string to json object
        data = json.loads(event['text']) 

        # Update the vote in the database
        await self.update_vote(data['eventId'], data['vote']) 
        print(data)
        # Send back the vote
        to_send = {
            'newVote': data['vote'],
            'previousVote': data['previousVote'],
        }
        
        await self.send({
            'type': 'websocket.send',
            'text': json.dumps(to_send)
        })



    async def websocket_disconnect(self, event):
        print("Disconnected")


    @database_sync_to_async
    def update_vote(self, event_id, vote):

        event = Event.objects.get(id=event_id) # Get the event object

        # Delete the existing vote
        vote_obj = Vote.objects.filter(event=event, user=self.scope['user']).first()
        try:
            vote_obj.delete()
        except:
            pass
        vote_obj = Vote(event=event, user=self.scope['user'], vote=int(vote))
        vote_obj.save()


    @database_sync_to_async
    def get_votes(self, event_id):

        event = Event.objects.get(id=event_id) # Get the event object

        # Dictionary to hold the count of votes
        vote_counts = {
            '1': 0,
            '2': 0,
            '3': 0,
        } 
        votes = Vote.objects.filter(event=event).all() # Get votes for the event
        for vote in votes:
            vote_counts[str(vote.vote)] += 1
        
        return vote_counts
