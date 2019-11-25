document.addEventListener('DOMContentLoaded', () =>{

    //Change background color of admins
    set_admins();    

    //Make clicking on add event button display the event maker menu
    event_maker = document.querySelector('#event_maker')
    document.querySelector('#add_event').onclick = ()=>{
        event_maker.style.display = 'block';
        event_maker.style.animationName = 'come_down';
        event_maker.style.animationPlayState = 'running';
    }

    //Make clicking on close_event_maker button to close the menu
    document.querySelector('#close_event_maker').onclick = ()=>{
        event_maker.style.animationName = 'go_up';
        event_maker.style.animationPlayState = 'running';
        event_maker.addEventListener('animationend', () => {
            if(event_maker.style.animationName === 'go_up')
                event_maker.style.display = 'none';
        })
    }
})

//Function to change background color of admins
function set_admins(){
    elements = document.getElementsByClassName("element");

    for(i=0; i<elements.length; i++){        
        if(elements[i].dataset.admin === 'True'){
            elements[i].style.backgroundColor = color_admin_background;
        }
    };
}


//Function when someone accepts some one
function accept(request_id, group_id, action){

    //Make the request
    request = new XMLHttpRequest();
    request.open('POST', `/groups/${group_id}/accept`);
    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);

    //When the request is loaded
    request.onload = ()=>{
        response = JSON.parse(request.responseText);
        console.log(response.success);        
        
        //If request was successful, get the correct html element and delete it
        if(response.success){
            div = document.getElementById(request_id);            
            div = div.parentElement.parentElement;

            //animate
            animate_and_remove(div);
        }
    }

    //setup the request and send
    data = new FormData();
    data.append('request_id', request_id);
    data.append('action', action);    
    request.send(data);

}

//Function to deal with member actions like adminify and removing
function member_action(membership_id, action){

    //Make the AJAX request
    request = new XMLHttpRequest();
    request.open('POST', `/groups/member_action`);
    csrftoken = getCookie('csrftoken');
    request.setRequestHeader('X-CSRFToken', csrftoken);
    
    request.onload = ()=>{
        response = JSON.parse(request.responseText);

        //If request was successful
        if(response.success){
            //if action was remove the the correct html element and delete it
            if(action==='remove'){
                div = document.getElementById(membership_id).parentElement;
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
    data = new FormData();
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
        div2 = "<div class='element circular-corners' id='dummy_div'></div>";

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