import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from django import db

from groups.models import Vote, Event

class EventConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        print("websocket_connect called for: ", event)
        db.connections.close_all()

        event_id = self.scope['url_route']['kwargs']['event_id']
        await self.channel_layer.group_add(
            f'event_{event_id}', # Name of the group to which to add
            self.channel_name # Which channel to add
        )

        await self.send({
            'type': 'websocket.accept'
        })
        db.connections.close_all()


    async def websocket_receive(self, event):
        print("websocket_receive called for: ", event)
        db.connections.close_all()

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
        
        await self.channel_layer.group_send(
            f'event_{data["eventId"]}',
            {
                'type': 'send_vote',
                'text': json.dumps(to_send),
            }
        )
        db.connections.close_all()


    async def websocket_disconnect(self, event):
        print("Disconnected")

    # To actually send the vote to the members of the group
    async def send_vote(self, event):
        db.connections.close_all()
        await self.send({
            'type': 'websocket.send',
            'text': event['text'],
        })
        db.connections.close_all()


    @database_sync_to_async
    def update_vote(self, event_id, vote):
        db.connections.close_all()

        event = Event.objects.get(id=event_id) # Get the event object

        # Delete the existing vote
        vote_obj = Vote.objects.filter(event=event, user=self.scope['user']).first()
        try:
            vote_obj.delete()
        except:
            pass
        vote_obj = Vote(event=event, user=self.scope['user'], vote=int(vote))
        vote_obj.save()
        db.connections.close_all()


    @database_sync_to_async
    def get_votes(self, event_id):
        db.connections.close_all()

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
        
        db.connections.close_all()
        return vote_counts
