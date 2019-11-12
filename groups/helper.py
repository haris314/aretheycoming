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


#Function to return JSON response from a list of (Group objects)s
def get_json_groups(group_list):

    data = []

    #Add all the groups in the data from the list of (Group objects)s
    for groups in group_list:
        for group in groups:

            #Shrink description length of lengthy descriptions
            if len(group.description) > 68:
                group.description = group.description[0 : 66] + ". ."    
            
            #Add the group
            data.append({
                'name' : group.name,
                'id' : group.id,
                'membersCount' : group.members.count(),
                'description' : group.description,
    
                'college': group.college,
                'graduationYear': group.graduation_year,
                'section': group.section,
                'batch': group.batch,
            })   
    
    return data