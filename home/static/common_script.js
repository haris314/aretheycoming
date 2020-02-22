//Global Variables
var color_admin_background = "rgba(53, 140, 81, .8)";

//helper function to get cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }    
    return cookieValue;
 }

/**Displays the popup message, takes 3 arguments
 * arg1: Text to be shown in the heading of the popup
 * arg2: Text to be shown in the body of the popup
 * arg3: A function which will be called if the user clicks "Yes" in the popup 
 */
displayPopupMessage = (headingText, bodyText, perform) =>{
    const popupMessageFrame = document.querySelector('#popup_message_frame'); // Get the popup div

    document.querySelector('#popup_message_heading').innerHTML = headingText;
    document.querySelector('#popup_message_body').innerHTML = bodyText;
    popupMessageFrame.style.display = "block";     

    document.querySelector('#popup_message_yes').onclick = ()=>{
        popupMessageFrame.style.display = "none";
        perform();
    }
    document.querySelector('#popup_message_no').onclick = () =>{
        popupMessageFrame.style.display = "none";
    }
    
}

