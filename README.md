# Group 

Member1:  Teemu Loijas, teemu.loijas@tuni.fi, 050090837, 
resposible for: - Handle all API in routes
                - Write jsdocs
                - Sonarqube coverage
                - Accessibility
                - FrontEnd: add to cart 
                - FrontEnd: shopping cart list
                - FrontEnd: increament item in cart

Member2:  Nghia Duc Hong, duc.hong@tuni.fi, H292119, 
resposible for: - Data model schemas : Product / Oder
                - Controllers : Products / Oder
                - frontEnd: Render orders in order page
                - frontEnd: send a request for sending an order.
                - frontEnd: request for adding an product.
                - Write documentations/UML diagram.

### Login credentials
    Customer:
        Username: customer@email.com
        Password: 0987654321

    Admin:
        Username: admin@email.com
        Password: 1234567890

### The project structure

```
.
├── index.js                --> homepage
├── package.json            --> json packages
├── routes.js               --> API handler
├── auth                    --> Authorization
│   └──  auth.js            --> authorizing functions
├── controllers             --> Controllers
│   ├── products.js         --> controller for product
│   └── users.js            --> controller for user
│   └── orders.js           --> controller for order 
├── models                  --> 
│   ├── product.js          --> Model for product
│   └── user.js             --> Model for user
│   └── order.js            --> Model for order   
│   └── db.js               --> mongoose set up   
├── public                  --> public HTML, scripts and images
│   ├── img                 --> product's image url and UML diagram
│   ├── js                  --> scripts
│   └── css                 --> styling
├── utils                   --> utility functions
│   ├── responseUtils       --> utilities for response
│   └── requestUtils        --> utilities for request
│   └── products            --> utilities for product
│   └── users               --> utilities for user
└── test                    --> tests
│   ├── auth                --> authorization test
│   ├── controllers         --> controller test
└── └── own                 --> own team test

```

## The architecture 

1. Short project descriptioon
This Vanilla web app project is done based on MVC structure. In this structure, all the interaction between model and view are handled by controller, and user interactions are handled in view, storing and retrieving data is managed by Model.
The models are implemented in /Model/* as the database for the web shop, with 3 database schemas : User, Product, and Order. 
The controller is implemented in folder /controllers/
View are implemented by HTML files and javascripts file in /public/
The system is designed to support REST api with necessary access right based on role of user.
2. Diagram
    - Structure Diagram : /public/img/MVC_structure_diagram.jpg
    - Navigation Diagram: /public/img/navDia.jpg
3. Data Models:
    - User:
        - Model: User
        - Attributes: id, name, emaill, password, role
        - Description: User Model is used to register and store users information and their roles.
    - Product:
        - Model: Product
        - Attribute: id, name, description, price, image
        - Description: Product Model is used to store available products which customers can buy.
    - Order:
        - Model: Order
        - Attribute: customerId, items [(prodductId, name, description, price), quantity]
        - Description: Order Model is used  to store purchase orders information for users.
        - Connection: customerId is from model User and productId is from model Product

## Tests and documentation

### Tests
We've only created a few extra test cases since the test cases from course side were comprehensive enough. We've added the test cases in to the same files where the course side tests are. The reason for adding them in to the same files is to decrease the usage of same kind of code. All the test files need same kind of constants to run correctly and there's no time for refactoring.

Files:
    /test/utils/responseUtils.test.js
    /test/routes.test.js
    /test/controllers/products.test.js


### Gitlab issues
    The gitlab board contains all the issues we've created.
    https://course-gitlab.tuni.fi/webdev1-2020-2021/webdev1-group-68/-/boards

## Security concerns
- Input Data : User input should not never be truested. Our user input is validated, handled by scripts. 
- Injection Attack: 
    - Cross-site scripting: The attacker formats input that the script is injected when the page is used by users.

    - SQL injection attack: hijack control over the web application database.
    
    - Data injection: gives instructions that have not been authorized.

    These attacks lead to data leaking, removal and manipulation of database. 
    To prevent this attacks, the user inputs, fetching requests must be sanitised before sending a request. We have all the requests body stringify before all the requests are made, and user inputs are also stringify as well.

- Brute force attack: the hacker attempting to guess the passwords and have access to the web application as admin role. We have encrypted our password and make sure password length is greater than 10. Which means the attacks have lower probability to happen.
