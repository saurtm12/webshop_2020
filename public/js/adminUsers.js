/**
 * TODO: 8.3 List all users (use <template id="user-template"> in users.html)
 *       - Each user should be put inside a clone of the template fragment
 *       - Each individual user HTML should look like this
 *         (notice the id attributes and values, replace "{userId}" with the actual user id)
 *
 *         <div class="item-row" id="user-{userId}">
 *           <h2 class="user-name" id="name-{userId}">Admin</h2>
 *           <p class="user-email" id="email-{userId}">admin@email.com</p>
 *           <p class="user-role" id="role-{userId}">admin</p>
 *           <button class="modify-button" id="modify-{userId}">Modify</button>
 *           <button class="delete-button" id="delete-{userId}">Delete</button>
 *         </div>
 *
 *       - Each cloned template fragment should be appended to <div id="users-container">
 *       - Use getJSON() function from utils.js to fetch user data from server
 */


 /* TODO: 8.5 Updating/modifying and deleting existing users
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 *       - Use deleteResource() function from utils.js to delete users from server
 *       - Clicking "Delete" button of a user will delete the user and update the listing accordingly
 *       - Clicking "Modify" button of a user will use <template id="form-template"> to
 *         show an editing form populated with the values of the selected user
 *       - The edit form should appear inside <div id="modify-user">
 *       - Afted successful edit of user the form should be removed and the listing updated accordingly
 *       - You can use removeElement() from utils.js to remove the form.
 *       - Remove edit form from the DOM after successful edit or replace it with a new form when another
 *         user's "Modify" button is clicked. There should never be more than one form visible at any time.
 *         (Notice that the edit form has an id "edit-user-form" which should be unique in the DOM at all times.)
 *       - Also remove the edit form when a user is deleted regardless of which user is deleted.
 *       - Modifying a user successfully should show a notification message "Updated user {User Name}"
 *       - Deleting a user successfully should show a notification message "Deleted user {User Name}"
 *       - Use createNotification() function from utils.js to create notifications
 */

//document.getElementById("btnRegister").addEventListener('click', register);
window.onload = function() {
    getJSON("/api/users").then(users => {
        // Do something with the json
        const template = document.getElementById("user-template");
        users.map(user => {
            const clone = template.content.cloneNode(true);
            const id = clone.querySelector("h3");
            const email = clone.querySelector("p");
            const role = clone.querySelectorAll("p")[1];
            const modifyButton = clone.querySelector("button");
            const deleteButton = clone.querySelectorAll("button")[1];
    
            id.innerHTML = user.name;
            id.id = `name-${user._id}`;
            email.innerHTML = user.email;
            email.id = `email-${user._id}`;
            role.innerHTML = user.role;
            role.id = `role-${user._id}`;
            modifyButton.id = `modify-${user._id}`;
            deleteButton.id = `delete-${user._id}`;

            modifyButton.addEventListener('click', function(event){
                removeElement("modify-user", "edit-user-form");
                modify(event);
            });

            deleteButton.addEventListener('click', function(event){
                remove(event);
            });
    
            const usersContainer = document.getElementById("users-container");
            usersContainer.append(clone);
        });
    });
};

/**
 * Modify texts
 *
 * @param {object} event event
 */
function modify(event){
    const buttonId = event.target.id;
    const splittedButtonId = buttonId.split("-");
    const userId = splittedButtonId[1];

    const userNames = document.getElementsByClassName("user-name");
    const userEmails = document.getElementsByClassName("user-email");
    const userRoles = document.getElementsByClassName("user-role");
    let name = "";
    let email = "";
    let role = "";
    const userNamesObject = Object.values(userNames);
    userNamesObject.map(username => {
        console.log(username);
        const innerId = username.id;
        if(innerId.includes(userId)){
            name = username.innerHTML;
        }
        return username;
    });
    const userEmailsObject = Object.values(userEmails);
    userEmailsObject.map(uEmail => {
        const innerId = uEmail.id;
        if(innerId.includes(userId)){
            email = uEmail.innerHTML;
        }
        return uEmail;
    });
    const userRolesObject = Object.values(userRoles);
    userRolesObject.map(uRole => {
        const innerId = uRole.id;
        if(innerId.includes(userId)){
            role = uRole.innerHTML;
        }
        return uRole;
    });

    const modifyUserContainer = document.getElementById("modify-user");
    const template = document.getElementById("form-template");
    const clone = template.content.cloneNode(true);

    const form = clone.getElementById("edit-user-form");

    const header = form.querySelector("h2");
    header.innerHTML = `Modify user ${name}`;

    const formGroups = form.getElementsByClassName("form-group");

    const idGroup = formGroups[0];
    const idInput = idGroup.querySelector("input");
    idInput.disabled = false;
    idInput.value = userId;

    const nameGroup = formGroups[1];
    const nameInput = nameGroup.querySelector("input");
    nameInput.disabled = false;
    nameInput.value = name;

    const emailGroup = formGroups[2];
    const emailInput = emailGroup.querySelector("input");
    emailInput.disabled = false;
    emailInput.value = email;

    const roleGroup = formGroups[3];
    const select = roleGroup.querySelector("select");
    select.selected = role;
    select.value = role;
    let myRole = "";
    myRole = role;
    select.onchange = function(){
        myRole = select.value;
    };

    const button = clone.getElementById("update-button");
    button.type = "button";
    button.classList.add("update-button");

    button.addEventListener('click', function(){
        const rows = document.getElementById("users-container").getElementsByClassName("item-row");
        const rowsObject = Object.values(rows);
        rowsObject.map(row => {
            const rowHeader = row.querySelector("h3");
            const rowEmail = row.querySelector("p");
            const rowRole = row.querySelectorAll("p")[1];
            if(rowHeader.id.includes(userId)) {
                rowHeader.innerHTML = nameInput.value;
                rowEmail.innerHTML = emailInput.value;
                rowRole.innerHTML = myRole;
            }
            return row;
        });
        submitForm(event, nameInput.value);
        const userData = {
            _id: idInput.value,
            name: nameInput.value,
            email: emailInput.value,
            role: myRole
        };
        postOrPutJSON(`/api/users/${userId}`, "PUT", JSON.stringify(userData));
        
    });

    modifyUserContainer.append(clone);
}

/**
 * Submit form
 *
 * @param {object} event http.ServerResponse
 * @param {string} name JSON data from request body
 */
function submitForm(event, name) {
    removeElement("modify-user", "edit-user-form");
    createNotification(`Updated user ${name}`, "notifications-container", true);
}

/**
 * Remove item
 *
 * @param {object} event http.ServerResponse
 */
function remove(event) {
    const id = event.target.id;
    const parsedId = id.split("-");
    const userNames = document.getElementsByClassName("user-name");
    let name = "";
    const userNamesObject = Object.values(userNames);
    userNamesObject.map(username => {
        const userId = username.id;
        if(userId.includes(parsedId[1])){
            name = username.innerHTML;
        }
        return username;
    });
    deleteResourse(`/api/users/${ parsedId[1]}` );
    createNotification(`Deleted user ${name}`, "notifications-container", true);
    const itemRow = event.path[1];
    itemRow.remove();
}
