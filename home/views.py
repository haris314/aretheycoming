from django.shortcuts import render, redirect

# Create your views here.

def home(request):
    if(request.user.is_authenticated):
        return redirect('/feed')
    return render(request, 'home/home.html')


def feed(request):
    return render(request, 'home/feed.html')