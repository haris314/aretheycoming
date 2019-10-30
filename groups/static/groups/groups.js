

//Get the group card template
var groupTemplate;

//set start and more variables for number of groups
var start = 0;
var count = 4;
var getMoreFlag = true;

//When the dom content is loaded
document.addEventListener("DOMContentLoaded", () => {

    //set the template
    groupTemplate = Handlebars.compile(document.querySelector('#groupCardTemplate').innerHTML);

    getGroups();
});

//Get more groups when at the end of page
window.onscroll = () =>{
    if(window.scrollY + window.innerHeight >= document.querySelector('#footer').offsetTop){ //
        getGroups();
    }
};

//function to get groups using AJAX
function getGroups(){
    if(getMoreFlag == false){
        return;
    }
    getMoreFlag = false;

    //Open the request
    request = new XMLHttpRequest;
    request.open('POST', '/groups/');

    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    request.onload = () => {

        //if status is not 200, print to console
        if(request.status != 200){
            console.log("Some problem occurred while loading the groups");
            return;           
        }

        //Get response
        response = JSON.parse(request.responseText);
        addGroups(response);
    }

    //append the data to a form and send the request
    data = new FormData();
    data.append('start', start);
    data.append('count', count);
    request.send(data);
    start += count;
}


var firstId;
//function to add the response groups to the web page
function addGroups(response){
    firstId = -1;

    //Iterate through all the groups in response
    response.forEach( group => {
        if(firstId == -1){
            firstId = group.id;
        }
        //create data
        data = {
            'group': {
                'name' : group.name,
                'id' : group.id,
                'membersCount' : group.membersCount,
                'description' : group.description,
    
                'college': group.college,
                'graduationYear': group.graduationYear,
                'section': group.section,
                'batch': group.batch,
            }
        }

        //Get content from template and add it to the document
        content = groupTemplate(data);
        document.querySelector(`#groupList`).innerHTML += content;
        getMoreFlag = true;       
    });
}

//function to send request to join a group
function sendRequest(id){
    
    //Get the button, disable it and change text to 'sending request'
    button = document.getElementById("btn"+id);
    button.disabled = true;
    button.innerHTML = "Sending request";

    //Open request
    request = new XMLHttpRequest();
    request.open('POST', `${id}/request`);
    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    //What happens when the response comes
    request.onload= () =>{
        
        if(request.status != 200){
            console.log("Something went wrong while sending the request");
            return;            
        }

        //Parse the response
        response = JSON.parse(request.responseText);

        //If the request did not succeed
        if(response.success == false){
            groupCard = document.getElementById(id);
            errorMessage = document.createElement('div');
            errorMessage.className = "red-text";
            errorMessage.style.height = '30px';
            errorMessage.innerHTML = response.reason;

            groupCard.append(errorMessage);
            button.innerHTML = "Can't send";
            return;
        }

        //If the request succeeds
        button.innerHTML = "Request sent";

    }

    //Send the request
    request.send();
    
}

        
    
        

