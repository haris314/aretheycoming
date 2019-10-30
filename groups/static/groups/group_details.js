
//Function when someone accepts some one
function accept(request_id, group_id){

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
            div = div.parentElement;

            //animate
            div.style.animationPlayState = 'running';
            div.addEventListener('animationed', () =>{
                div.remove();
            })
        }
    }

    //setup the request and send
    data = new FormData();
    data.append('request_id', request_id);
    request.send(data);

}