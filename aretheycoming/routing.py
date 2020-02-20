from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator

from groups.consumers import EventConsumer

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                    # url('ws/event/<int:event_id>', EventConsumer),
                    url(r"^ws/event/(?P<event_id>\w+)$", EventConsumer),
                    # url(r"^ws/event/(?P<event_id>\w+)/$", EventConsumer),

                ]
            )
        )
    )

})
