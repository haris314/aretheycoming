document.addEventListener('DOMContentLoaded', () => {
   
   //get all the relevant elements
   var loginForm = document.querySelector('#loginForm');
   var loginUsername = document.querySelector('#loginUsername');
   var loginMessage = document.querySelector('#loginMessage');

   var username = document.querySelector('#username');
   var usernameMessage = document.querySelector('#usernameMessage');

   var password = document.querySelector('#password');
   var passwordMessage = document.querySelector('#passwordMessage');

   var confirmPassword = document.querySelector('#confirmPassword');
   var confirmPasswordMessage = document.querySelector('#confirmPasswordMessage');

   var firstName = document.querySelector('#firstName');
   var firstNameMessage = document.querySelector('#firstNameMessage');

   //Keep checking the registration form every second
   setInterval(checkForm, 1000);

   //set the sunmit action for login
   loginForm.onsubmit = checkLogin;

   //set form submit action for registration
   document.querySelector('#submit').onsubmit = checkFormOnSubmit;

   //set username checking
   username.onkeyup = checkRegisterationUserName;
});



/*This variable lets the "password don't match" message stay on screen
 *when form is submitted and passwords don't match.
*/
var letItBe = false;

//To keep checking registration form
function checkForm(){

   //check if password and confirm passwrod match
   if(confirmPassword.value.length >= 1 || letItBe==true){
      if(password.value == confirmPassword.value){
         confirmPasswordMessage.innerHTML = "Passwords match";
         confirmPasswordMessage.className = "green-text";
      }
      else{
         confirmPasswordMessage.innerHTML = "Passwords don't match";
         confirmPasswordMessage.className = "red-text";
      }
   }
   else{
      confirmPasswordMessage.innerHTML = "";
   }

}


//To check things when the form is submitted
function checkFormOnSubmit(){

   //check username
   if (username.value.length < 1){
      usernameMessage.innerHTML = "Username can't be empty";
      return false;
   }
   else{
      usernameMessage.innerHTML = "";
   }

   //check password
   if (password.value.length < 1){
      passwordMessage.innerHTML = "Password can't be empty";
      return false;
   }
   else{
      passwordMessage.innerHTML = "";
   }

   //check passwrod
   if (firstName.value.length < 1){
      firstNameMessage.innerHTML = "First name can't be empty";
      return false;
   }
   else{
      firstNameMessage.innerHTML = "";
   }

   //check confirm password
   if (confirmPassword.value != password.value){
      letItBe = true;
      return false;
   }
   
   return true;
}


//An intermediate function to call the real function
function checkLogin(){
   checkUsername(loginUsername, loginMessage, true);
   return false;
}

//Another intermediate function to call the real function
function checkRegisterationUserName(){
   checkUsername(username, usernameMessage, false);
}

//To check if username exists
function checkUsername(textField, messageField, isLogin){

   //clear the messageField
   messageField.innerHTML = ""

   //If username is empty, just clear the message
   if(textField.value.length < 1){
      messageField.innerHTML = "";
      return;     
   }

   //check if the username consists invalid chars
   var flag = true;
   textField.value.split('').forEach( (c) => {
      if (!(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z') && !(c == '_') && !(c >= '0' && c <= '9')){
         flag = false;      
      }
   } );
   
   //do the check
   if(flag===false){
      messageField.innerHTML = "Invalid username";
      messageField.className = "red-text";   

      //If login has called, then false must be returned to prevent the form from submitting      
      if(isLogin){
         return false;
      }
      return;
   }

   //If the username passes initial tests
   checkFromDb(textField.value, messageField, isLogin);
   
}

//To actually send request and check
function checkFromDb(usernameValue, messageField, isLogin){
   
   //Make request
   const request = new XMLHttpRequest();
   request.open('POST', '/login/check_ajax');

   csrftoken = getCookie('csrftoken');
   request.setRequestHeader('X-CSRFToken', csrftoken);

   //Callback function for when request completes
   request.onload = () => {
      if(request.status != 200){
         console.log(`status code ${request.status}`);
         return;         
      }

      const response = JSON.parse(request.responseText);

      //if this is login,
      if(isLogin){
         if(response.exists == false){
            messageField.innerHTML = "Username does not exist";
   
            return false;
         }
         else{
            loginForm.submit();
            return;
         }
      }
      
      //Else handle the cases for registration
      if(response.exists){
         messageField.innerHTML = "Username already exists";
         messageField.className = "red-text";

      }
      else{
         messageField.innerHTML = "Username is valid";
         messageField.className = "green-text";

      }
   };

   //send request
   data = new FormData();
   data.append('username', usernameValue);
   request.send(data);
}







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