import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

from groups.models import Vote, Event

class EventConsumer(AsyncConsumer):

    async def websocket_connect(self, event):

        event_id = self.scope['url_route']['kwargs']['event_id']
        await self.channel_layer.group_add(
            f'event_{event_id}', # Name of the group to which to add
            self.channel_name # Which channel to add
        )

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
        
        await self.channel_layer.group_send(
            f'event_{data["eventId"]}',
            {
                'type': 'send_vote',
                'text': json.dumps(to_send),
            }
        )


    async def websocket_disconnect(self, event):
        print("Disconnected")

    # To actually send the vote to the members of the group
    async def send_vote(self, event):
        await self.send({
            'type': 'websocket.send',
            'text': event['text'],
        })

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
