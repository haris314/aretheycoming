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
   username.onkeyup = checkRegistrationUserName;
});



/*This variable lets the "password don't match" message stay on screen
 *when form is submitted and passwords don't match.
*/
var letItBe = false;

//To keep checking registration form
function checkForm(){

   //check if password and confirm password match
   if(confirmPassword.value.length >= 1 || letItBe==true){
      if(password.value == confirmPassword.value){
         setHTML(confirmPasswordMessage, "Passwords match", "green");
      }
      else{
         setHTML(confirmPasswordMessage, "Passwords don't match", "red");
      }
   }
   else{
      setHTML(confirmPasswordMessage, "", "white");
   }

}


//To check things when the form is submitted
function checkFormOnSubmit(){

   //check username
   if (username.value.length < 1){
      setHTML(usernameMessage, "Username can't be empty", "red");
      return false;
   }
   else{
      setHTML(usernameMessage, "", "white");
   }
   checkRegistrationUserName();

   //check password
   if (password.value.length < 1){
      setHTML(passwordMessage, "Password can't be empty", "red");
      return false;
   }
   else{
      setHTML(passwordMessage, "", "white");
   }

   //check first name
   if (firstName.value.length < 1){
      setHTML(firstNameMessage, "First name can't be empty", "red");
      return false;
   }
   else{
      setHTML(firstNameMessage, "", "white");
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
function checkRegistrationUserName(){
   checkUsername(username, usernameMessage, false);
}

//To check if username exists
function checkUsername(textField, messageField, isLogin){

   //clear the messageField
   setHTML(messageField, "", "white");

   //If username is empty, just clear the message
   if(textField.value.length < 1){
      setHTML(messageField, "", "white");
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
      setHTML(messageField, "Invalid username", "red");

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
            setHTML(messageField, "Username does not exist", "red");   
            return false;
         }
         else{
            loginForm.submit();
            return;
         }
      }
      
      //Else handle the cases for registration
      if(response.exists){
         setHTML(messageField, "Username already exists", "red");
      }
      else{
         setHTML(messageField, "Username is valid", "green");
      }
   };

   //send request
   data = new FormData();
   data.append('username', usernameValue);
   request.send(data);
}


//helper function to set innerHTML of elements
function setHTML(element, message, color){
   className = color + "-" + "text";
   element.innerHTML = message;
   element.className = className;
   
}

