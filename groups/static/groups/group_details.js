const dataItems = document.querySelector("#data-items").dataset; // Get the data set from the html page
const groupId = dataItems.group_id;
const csrftoken = getCookie('csrftoken');

/**Render the active events container */
ReactDOM.render(
    <EventsContainer 
        showGroupName={false} 
        groupId={groupId} 
        memberFlag = {dataItems.member_flag === 'True'? true: false}
        active={true} // If user is a member of the group, show them
    />, document.querySelector("#active_events_container")
);


// Change background color of admins
set_admins();   

// Set onclick listener for delete group and leave group button
const deleteOrLeaveMessage = document.querySelector('#delete_or_leave_message');

const deleteHeading = "Delete this group permanently?";
const deleteBody = "Deleting will remove all the group members, requests and events belonging to this group permanently. This can't be reversed.";

try{ // Gotta put this in try block because delete_group_btn may not always be present
    document.querySelector('#delete_group_btn').onclick = () =>{
        displayPopupMessage(deleteHeading, deleteBody, () =>{ 

            window.location.href = `/groups/${groupId}/delete_group`;         

        });
    }
}
catch(e){}

const leaveHeading = "Leave this group?";
const leaveBody = "You will no longer be a member of this group. You can request to join back as a new member later.";

try{ // Gotta put this in try block because leave_group_btn may not always be present
    document.querySelector('#leave_group_btn').onclick = () =>{

        displayPopupMessage(leaveHeading, leaveBody, () => {
            
            /**Setup the AJAX request to send to leave the group */
            const request = new XMLHttpRequest();
            request.open('POST', `/groups/${groupId}/leave_group`);
            request.setRequestHeader('X-CSRFToken', csrftoken);

            request.onload = () => {

                // If request's status was not 200 or if response had {success: false}, show error and return
                if(request.status != 200){
                    setMessage(deleteOrLeaveMessage, "Something went wrong. Please try again!", "red");
                    return;
                }
                const response = JSON.parse(request.responseText);
                if(response.success === false){
                    setMessage(deleteOrLeaveMessage, "Something went wrong. Please try again!", "red");
                    return;
                }

                // Reload the page otherwise
                window.location.reload();

            }

            request.send();
        });
    }
}
catch(e){}


// Set onclick listener for make event button
document.querySelector("#make_event").onclick = () =>{
    // Get the message div in a variable. Used for setMessage function
    const message = document.querySelector("#event_maker_message");

    // Name of the event must not be empty
    if (document.querySelector("#name").value.length == 0){
        setMessage(message, "Name can't be empty!", "red");
        return false;
    }
    else{
        setMessage(message, "", "white");
    }

    // Date and time must not be empty
    const startDate = document.querySelector("#start_datetime").value;
    const endDate = document.querySelector("#end_datetime").value;
    if(startDate === "" || endDate === ""){
        setMessage(message, "Please provide proper date and time", "red");
        return false;
    }
    else{
        setMessage(message, "", "white");
    }

    // Start date must not be greater or equal to end date
    if(new Date(startDate) >= new Date(endDate)){
        console.log(startDate + " " + endDate)
        setMessage(message, "Start date can't be same as or after the end date. How do you feel being stupider than a machine?", "red");
        return false;
    }


    // Disable the create event button
    document.querySelector("#make_event").disabled = true;

    // Send request to the server to create event
    const request = new XMLHttpRequest();
    request.open('POST', `/groups/${groupId}/create_event`);
    request.setRequestHeader('X-CSRFToken', csrftoken);

    //Get the division to show the message. Below "add event+" button
    const eventMakerMessage = document.querySelector("#add_event_message");

    request.onload = () =>{
        
        const response = JSON.parse(request.responseText);
        
        if(request.status != 200 || response.success === false){
            setMessage(eventMakerMessage, "There was problem while creating event :(", "red");
        }
        else{
            // If request was successful, set message that the event was successfully created                  
            setMessage(eventMakerMessage, "Event created successfully! Please reload to see the newly created event", "black");                
        }
        eventMakerGoUp();
    }

    // Setup the request and send
    const data = new FormData();

    data.append('name', document.querySelector("#name").value);
    data.append('start_datetime', document.querySelector("#start_datetime").value);
    data.append('end_datetime', document.querySelector("#end_datetime").value);
    data.append('description', document.querySelector("#description").value);

    request.send(data);
    
    return false; // So that the page doesn't refresh because of form submission
}

// Function to set the message
function setMessage(message, message_value, color){
    console.log(message);
    message.innerHTML = message_value;
    message.style.color = color;
    
}

// Make clicking on add event button display the event maker menu
const event_maker = document.querySelector('#event_maker')

function eventMakerComeDown(){
    event_maker.style.display = 'block';
    event_maker.style.animationName = 'come_down';
    event_maker.style.animationPlayState = 'running';
}

function eventMakerGoUp(){
    event_maker.style.animationName = 'go_up';
    event_maker.style.animationPlayState = 'running';
    event_maker.addEventListener('animationend', () => {
        if(event_maker.style.animationName === 'go_up')
            event_maker.style.display = 'none';
    })
}

try{ // add_event button will not be present if the user is not a member of the group or is not logged in
    document.querySelector('#add_event').onclick = ()=>{
        eventMakerComeDown();
    }
}
catch(e){}


// Make clicking on close_event_maker button to close the menu
document.querySelector('#close_event_maker').onclick = ()=>{
    eventMakerGoUp();
}

// Set onclick listener for load_past_events
document.querySelector('#load_past_events').onclick = () => {
    document.querySelector('#load_past_events').style.display = "none"; // Make the button disappear
    /**Render the inactive events container */
    ReactDOM.render(
        <EventsContainer
            showGroupName={false}
            groupId={groupId}
            active={false}
        />, document.querySelector("#inactive_events_container")
    );
}

// Set onclick listener for join group button only if that button is present
if (document.querySelector("#join_group_btn") !== null){
    document.querySelector("#join_group_btn").onclick = () =>{

        // Get the button, disable it and change text to 'sending request'
        const button = document.querySelector("#join_group_btn");
        button.disabled = true;
        button.innerHTML = "Sending request";

        // Open request
        const request = new XMLHttpRequest();
        request.open('POST', `${groupId}/request`);
        request.setRequestHeader('X-CSRFToken', csrftoken);

        // What happens when the response comes
        const message = document.querySelector('#join_group_message');
        request.onload= () =>{
            
            if(request.status != 200){
                console.log("Something went wrong while sending the request");
                setMessage(message, "An error ocurred. Pleased reload the page and try again", "red");
                button.innerHTML = "Can't send";
                return;            
            }

            // Parse the response
            const response = JSON.parse(request.responseText);

            // If the request did not succeed
            if(response.success == false){
                setMessage(message, response.reason, "red");
                button.innerHTML = "Can't send";
                return;
            }

            // If the request succeeds
            button.innerHTML = "Request sent";

        }

        // Send the request
        request.send();
    }
}



// Function to change background color of admins
function set_admins(){
    const elements = document.getElementsByClassName("element");

    for(let i=0; i<elements.length; i++){        
        if(elements[i].dataset.admin === 'True'){
            elements[i].style.backgroundColor = color_admin_background;
        }
    };
}


// Function when someone accepts some one
function accept(request_id, group_id, action){

    // Make the request
    const request = new XMLHttpRequest();
    request.open('POST', `/groups/${group_id}/accept`);
    request.setRequestHeader('X-CSRFToken', csrftoken);

    // When the request is loaded
    request.onload = ()=>{
        const response = JSON.parse(request.responseText);
        console.log(response.success);        
        
        // If request was successful, get the correct html element and delete it
        if(response.success){
            var div = document.getElementById(request_id);            
            div = div.parentElement.parentElement;

            // Animate
            animate_and_remove(div);
        }
    }

    // Setup the request and send
    const data = new FormData();
    data.append('request_id', request_id);
    data.append('action', action);    
    request.send(data);

}

// Function to deal with member actions like adminify and removing
function member_action(membership_id, action){

    displayPopupMessage(
        action === 'adminify'? "Promote to admin?": "Remove group member?",
        action === 'adminify'? "This member will be promoted to an admin of the group forever. This action can't be reversed.": 
            "This member will be removed from group. This action can't be reversed.",
            () => {
                // Make the AJAX request
                const request = new XMLHttpRequest();
                request.open('POST', `/groups/member_action`);
                const csrftoken = getCookie('csrftoken');
                request.setRequestHeader('X-CSRFToken', csrftoken);

                request.onload = ()=>{
                    const response = JSON.parse(request.responseText);

                    // If request was successful
                    if(response.success){
                        // If action was remove then get the correct html element and delete it
                        if(action==='remove'){
                            var div = document.getElementById(membership_id).parentElement;
                        }
                        // Action was adminify so hide the adminify button and change background color
                        else{
                            div = document.getElementById(membership_id);
                            div.parentElement.style.backgroundColor = color_admin_background;
                        }

                        // Animate
                        animate_and_remove(div);
                    }
                    else{
                        console.log(response.success);                        
                    }
                }
                // Setup request and send
                const data = new FormData();
                data.append('membership_id', membership_id);
                data.append('action', action);    
                request.send(data);  
            }  
    );
}


// Function to animate and remove the requests and members
function animate_and_remove(div){

    // First run the fadeout animation
    div.style.animationName = 'fadeout';
    div.style.animationPlayState = 'running';

    // When fadeout is done
    div.addEventListener('animationend', ()=>{

        // Make a dummy division physically similar to the element division which has to be removed
        var div2 = "<div class='element circular-corners' id='dummy_div'></div>";

        // Insert the dummy division after the element which has to be removed and remove element div
        div.insertAdjacentHTML('afterend', div2);
        div.remove();

        // Get the dummy division which was added, play the animation and remove the dummy div
        div2 = document.querySelector('#dummy_div');
        div2.style.opacity = '0';

        div2.style.animation = 'shrink 0.2s forwards running';
        div2.addEventListener('animationend', ()=>{
            div2.remove();
        })         
    });
}