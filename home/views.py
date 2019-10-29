from django.shortcuts import render, redirect

# Create your views here.

#Displayes home page if not logged in
#Sends to feed if logged in
def home(request):

    #If the user is already logged in, send to feed
    if(request.user.is_authenticated):
        return redirect('/feed')

    #Else show home page
    return render(request, 'home/home.html')


def feed(request):

    #If not logged in, send to login page
    if(not request.user.is_authenticated):
        return redirect('/login')
    
    #Else show feed
    return render(request, 'home/feed.html')