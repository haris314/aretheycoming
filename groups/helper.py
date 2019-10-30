from .models import Group, Membership, Request

#Function to return whether the current user is admin of the given group or not
def is_admin(request, group):

    #if the user is not logged in return false
    if(request.user.is_authenticated is False):
        return False
    
    #Get Membership
    membership = Membership.objects.filter(group=group, user=request.user).first()

    #If User is not even a member, return false
    if(membership is None):
        return False
    
    #Now check if the member is admin
    return membership.admin;