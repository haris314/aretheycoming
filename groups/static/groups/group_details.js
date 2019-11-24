document.addEventListener('DOMContentLoaded', () =>{
    console.log("Set");
    set_admins();    
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
            div.style.animationPlayState = 'running';
            div.addEventListener('animationend', () =>{
                div.remove();
            })
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
            div.style.animationPlayState = 'running';
            div.addEventListener('animationend', () =>{
                div.remove();
            });
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