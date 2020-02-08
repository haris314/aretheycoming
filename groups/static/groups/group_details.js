//Get group id
const groupId = document.querySelector("#data-items").dataset.group_id;

ReactDOM.render(<EventsContainer groupId={groupId} showGroupName={false}/>, document.querySelector("#active_events_container"));

//Change background color of admins
set_admins();   



//Set onclick listener for make event button
document.querySelector("#make_event").onclick = () =>{
    //Get the message div in a variable. Used for setMessage function
    const message = document.querySelector("#event_maker_message");

    //Name of the event must not be empty
    if (document.querySelector("#name").value.length == 0){
        setMessage(message, "Name can't be empty!", "red");
        return false;
    }
    else{
        setMessage(message, "", "white");
    }

    //Date and time must not be empty
    if(document.querySelector("#start_datetime").value === "" ){
        setMessage(message, "Please provide proper start date and time", "red");
        return false
    }
    else{
        setMessage(message, "", "white");
    }

    //Disable the create event button
    document.querySelector("#make_event").disabled = true;

    //Send request to the server to create event
    const request = new XMLHttpRequest();
    request.open('POST', `/groups/${groupId}/create_event`);
    const csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    //Get the division to show the message. Below "add event+" button
    const eventMakerMessage = document.querySelector("#add_event_message");

    request.onload = () =>{
        
        const response = JSON.parse(request.responseText);
        
        if(request.status != 200 || response.success === false){
            setMessage(eventMakerMessage, "There was problem while creating event :(", "red");
        }
        else{
            //If request was successful, set message that the event was successfully created                  
            setMessage(eventMakerMessage, "Event created successfully", "green");                
        }
        eventMakerGoUp();
    }

    //setup the request and send
    const data = new FormData();

    data.append('name', document.querySelector("#name").value);
    data.append('start_datetime', document.querySelector("#start_datetime").value);
    data.append('end_datetime', document.querySelector("#end_datetime").value);
    data.append('description', document.querySelector("#description").value);

    request.send(data);
    
    return false; // So that the page doesn't refresh because of form submission
}

//Function to set the message
function setMessage(message, message_value, color){
    console.log(message);
    message.innerHTML = message_value;
    message.style.color = color;
    
}

//Make clicking on add event button display the event maker menu
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

document.querySelector('#add_event').onclick = ()=>{
    eventMakerComeDown();
}

//Make clicking on close_event_maker button to close the menu
document.querySelector('#close_event_maker').onclick = ()=>{
    eventMakerGoUp();
}


//Function to change background color of admins
function set_admins(){
    const elements = document.getElementsByClassName("element");

    for(let i=0; i<elements.length; i++){        
        if(elements[i].dataset.admin === 'True'){
            elements[i].style.backgroundColor = color_admin_background;
        }
    };
}


//Function when someone accepts some one
function accept(request_id, group_id, action){

    //Make the request
    const request = new XMLHttpRequest();
    request.open('POST', `/groups/${group_id}/accept`);
    const csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    //When the request is loaded
    request.onload = ()=>{
        const response = JSON.parse(request.responseText);
        console.log(response.success);        
        
        //If request was successful, get the correct html element and delete it
        if(response.success){
            var div = document.getElementById(request_id);            
            div = div.parentElement.parentElement;

            //animate
            animate_and_remove(div);
        }
    }

    //setup the request and send
    const data = new FormData();
    data.append('request_id', request_id);
    data.append('action', action);    
    request.send(data);

}

//Function to deal with member actions like adminify and removing
function member_action(membership_id, action){

    //Make the AJAX request
    const request = new XMLHttpRequest();
    request.open('POST', `/groups/member_action`);
    const csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);
    
    request.onload = ()=>{
        const response = JSON.parse(request.responseText);

        //If request was successful
        if(response.success){
            //if action was remove then get the correct html element and delete it
            if(action==='remove'){
                var div = document.getElementById(membership_id).parentElement;
            }
            //action was adminify so hide the adminify button and change background color
            else{
                div = document.getElementById(membership_id);
                div.parentElement.style.backgroundColor = color_admin_background;
            }

            //animate
            animate_and_remove(div);
        }
        else{
            console.log(response.success);
            
        }
    }

    //Setup request and send
    const data = new FormData();
    data.append('membership_id', membership_id);
    data.append('action', action);    
    request.send(data);
}


//Function to animate and remove the requests and members
function animate_and_remove(div){

    //First run the fadeout animation
    div.style.animationName = 'fadeout';
    div.style.animationPlayState = 'running';

    //When fadeout is done
    div.addEventListener('animationend', ()=>{

        //Make a dummy division physically similar to the element division which has to be removed
        var div2 = "<div class='element circular-corners' id='dummy_div'></div>";

        //Insert the dummy division after the element which has to be removed and remove element div
        div.insertAdjacentHTML('afterend', div2);
        div.remove();

        //Get the dummy division which was added, play the animation and remove the dummy div
        div2 = document.querySelector('#dummy_div');
        div2.style.opacity = '0';

        div2.style.animation = 'shrink 0.2s forwards running';
        div2.addEventListener('animationend', ()=>{
            div2.remove();
        })         
    });
}