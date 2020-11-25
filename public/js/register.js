/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */
document.getElementById("btnRegister").addEventListener('click', register);

/**
 * Register.
 *
 */
function register(){
    event.preventDefault();
    const registerForm = document.getElementById("register-form");
    const name = registerForm.querySelectorAll("input")[0].value;
    const email = registerForm.querySelectorAll("input")[1].value;
    const password = registerForm.querySelectorAll("input")[2].value;
    //const passwordConfirmation = registerForm.querySelectorAll("input")[3].value;
    let registerData = {
        name: name,
        email: email,
        password: password
    };
    registerData = JSON.stringify(registerData);
    postOrPutJSON("/api/register", "POST", registerData);
}
