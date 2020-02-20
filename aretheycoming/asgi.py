import os
import django
from channels.routing import get_default_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "aretheycoming.settings")
django.setup()
os.environ['ASGI_THREADS']="15"
application = get_default_application()
