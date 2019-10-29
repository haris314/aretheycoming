from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse, Http404

# Create your views here.


#when the user clicks log in or wants to log in
def login_view(request):

    #if user is already logged in
    if(request.user.is_authenticated):
        #return HttpResponseRedirect(request, reverse("feed"))
        print("the user is authenticated with {request.user.username}")
        return redirect("feed")

    #if mehtod is POST, someone tried to login
    if(request.method == 'POST'):

        #get username and passwrod from post request
        username = request.POST['username']
        password = request.POST['password']
        username = username.lower()

        #authenticate
        user = authenticate(request, username=username, password=password)

        #if the credentials were wrong
        if user is None:
            return render(request, 'error.html', {"message":"Invalid credentials"})
        
        #else login and and redirect to the user's feed
        login(request, user)
        return redirect("feed")
    
    #if the user is not logged in, show login/signup page
    return render(request, 'users/login.html')


#When the user clicks sign up
def sign_up(request):

    #if method is get, someone is trying to access it without submitting a form
    if(request.method == 'GET'):
        return render(request, 'error.html', {"message": "404 not found"})
    
    #if hte method is post
    username = request.POST["username"].lower()
    password = request.POST["password"]
    confirm_password = request.POST["confirm_password"]
    first_name = request.POST["first_name"].capitalize()
    last_name = request.POST["last_name"].capitalize()

    #If something is still not right even after checks at frontend
    if (User.objects.filter(username=username).first() is not None) or (password != confirm_password) or (len(password) < 1) or (len(first_name) < 1):
        return render(request, 'error.html', {"message": "Something went wrong"})

    #Make another user and add to database
    user = User.objects.create_user(username=username, password=password)
    user.first_name = first_name
    user.last_name = last_name
    
    try:
        user.save()
    except Exception:
        return render(request, 'error.html', {"message": "Something went wrong"})

    return render(request, 'users/successfully_registered.html')


#When someone clicks logout
def logout_view(request):
    logout(request)
    return redirect('/login')


#AJAX request to check if a user exists
def check_username_ajax(request):
    if(request.method is 'GET'):
        return HttpResponse(status=404)

    #get username
    try:
        username = request.POST["username"].lower()
    except Exception:
        return HttpResponse(status=404)

    #If somehow someone sends a blank request
    if len(username) < 1:
        return JsonResponse({'exists': False, 'invalid': True})

    #Set exists = true if username exists else false
    if (User.objects.filter(username=username).first() is None):
        exists = False
    else:
        exists = True
    data = {
        'exists': exists
    }
    print(f"Returning {exists}")
    return JsonResponse(data)
    

