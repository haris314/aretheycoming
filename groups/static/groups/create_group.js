//var name, college, graduation_year, section, batch, message;

//Set the event listener and assign the values 
document.addEventListener('DOMContentLoaded', () => {

    //Get all the DOM elements    
    group_name = document.querySelector('#name')   
    college = document.querySelector('#college')
    graduation_year = document.querySelector('#graduation_year')
    section = document.querySelector('#section')
    batch = document.querySelector('#batch')
    message = document.querySelector('#message')
    console.log(message);
    document.querySelector('#form').onsubmit = do_the_checks
})


//Function to do the checks
function do_the_checks() {
    console.log(message);
    
    //Group name must not be empty
    if(group_name.value === ""){
        setMessage("Group name can't be empty", "red")
        return false
    }

    //Name must be at most 50 characters
    if (group_name.value.length > 50){
        setMessage("Name too long. Keep it below 50 characters", "red")
        return false
    }

    //If batch or section is not empty then college and passing year must not be empty
    if (batch.value != '' || section.value != ''){
        if(college.value === '' || graduation_year.value === ''){
            setMessage("Please fill college and passing_year before filling section and/or batch", "red")
            return false
        }
    }

    //Section must be 1 character and batch must be at most 2 long
    if (section.value.length > 1 || batch.value.length > 2){
        setMessage("Section must be exactly 1 character long and batch must be at most 2 characters long", "red")
        return false
    }

    return true;
}


//Function to set the message
function setMessage(message_value, color){
    message.innerHTML = message_value;
    message.className = color + "-text";
}