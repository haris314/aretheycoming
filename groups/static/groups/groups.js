

// Get the group card template
var groupTemplate;

// Set start and more variables for number of groups
var start = 0;
var count = 8;
var getMoreFlag = true;

// To prevent from loading groups on scrolling when the user has filtered groups
var loadFlag = true;

// When the dom content is loaded
document.addEventListener("DOMContentLoaded", () => {

    // set the template
    groupTemplate = Handlebars.compile(document.querySelector('#groupCardTemplate').innerHTML);

    // Get the filter_keyword filed and set the event listener
    document.querySelector("#filter_btn").onclick = filterGroups;

    // Get groups for the first time
    getGroups();
});

// Get more groups when at the end of page
window.onscroll = () =>{
    if (loadFlag == false){
        return
    }
    if(window.scrollY + window.innerHeight >= document.querySelector('#footer').offsetTop){ //
        getGroups();
    }
};

// Function to get groups using AJAX
function getGroups(){
    if(getMoreFlag == false){
        return;
    }
    getMoreFlag = false;

    // Open the request
    request = new XMLHttpRequest;
    request.open('POST', '/groups/');

    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    request.onload = () => {

        // If status is not 200, print to console
        if(request.status != 200){
            console.log("Some problem occurred while loading the groups");
            return;           
        }

        // Get response
        response = JSON.parse(request.responseText);
        addGroups(response);
    }

    // Append the data to a form and send the request
    data = new FormData();
    data.append('start', start);
    data.append('count', count);
    request.send(data);
    start += count;
}


var firstId;
// Function to add the response groups to the web page
function addGroups(response){
    firstId = -1;

    /**If any group is ever added to the group list, the group_list_message get empties */
    if(response.length !== 0){
        document.querySelector("#group_list_message").innerHTML = ""; 
    }

    // Iterate through all the groups in response
    response.forEach( group => {


        if(firstId == -1){
            firstId = group.id;
        }
        // Create data
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

        // Get content from template and add it to the document
        content = groupTemplate(data);
        document.querySelector(`#group_list`).innerHTML += content;
        getMoreFlag = true;       
    });
}

// Function to send request to join a group
function sendRequest(id){
    
    // Get the button, disable it and change text to 'sending request'
    button = document.getElementById("btn"+id);
    button.disabled = true;
    button.innerHTML = "Sending request";

    // Open request
    request = new XMLHttpRequest();
    request.open('POST', `${id}/request`);
    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    // What happens when the response comes
    request.onload= () =>{
        
        if(request.status != 200){
            console.log("Something went wrong while sending the request");
            return;            
        }

        // Parse the response
        response = JSON.parse(request.responseText);

        // If the request did not succeed
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

        // If the request succeeds
        button.innerHTML = "Request sent";

    }

    // Send the request
    request.send();
    
}

        
// Function to Filter groups
filterGroups = () => {

    // Get the keyword
    keyword = filter_keyword.value;

    // If the length is 0 then do nothing
    if(keyword.length === 0){
        document.querySelector('#group_list').innerHTML = "";

        // Set start = 0 to start loading from the beginning
        start = 0;

        // loadFlag = true to allow loading more groups when hitting the bottom while scrolling
        loadFlag = true;
        
        getGroups();
        return false; // For form action
    }

    // If the length is not zero, get groups based on filter keyword
    // Open the request
    request = new XMLHttpRequest();
    request.open('POST', 'filter');
    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    // When the response comes, clear the group list and add the new groups
    request.onload = () =>{

        loadFlag = false;

        if(request.status != 200){
            console.log("Something went wrong while sending the request");
            return;            
        }

        // Clear the current groups from the group list
        document.querySelector('#group_list').innerHTML = '';

        // Get response and add them
        response = JSON.parse(request.responseText);

        if (response.length === 0){
            document.querySelector("#group_list_message").innerHTML = "No matching groups!";
        }

        addGroups(response);
    }

    // Send the request
    data = new FormData();
    data.append('keyword', keyword);
    request.send(data);

    return false; // For form action
}    
        

