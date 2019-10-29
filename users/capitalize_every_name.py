from django.contrib.auth.models import User

users = User.objects.all()
for user in users:
    user.first_name.capitalize()
    user.last_name.capitalize()
    print(f"capitalized {{user.first_name}} {{user.last_name}}")
