const sessionStorageItems = {...sessionStorage};

const template = document.getElementById("cart-item-template");

document.getElementById("place-order-button").addEventListener('click', function(event){
    placeOrder();
})

for (item in sessionStorageItems) {
    let itemObject = sessionStorage.getItem(item);
    itemObject = JSON.parse(itemObject);
    const clone = template.content.cloneNode(true);
    const name = clone.querySelector("h3");
    const price = clone.querySelector("p");
    const amount = clone.querySelectorAll("p")[1];
    const plusButton = clone.querySelectorAll("button")[0];
    const minusButton = clone.querySelectorAll("button")[1];

    name.id = `name-${itemObject._id}`;
    name.innerHTML = itemObject.name;

    price.id = `price-${itemObject._id}`
    price.innerHTML = itemObject.price;

    amount.id = `amount-${itemObject._id}`
    amount.innerHTML = itemObject.amount + "x";

    minusButton.id = `minus-${itemObject._id}`;

    plusButton.id = `plus-${itemObject._id}`;

    minusButton.addEventListener('click', function(event) {
        removeProduct(itemObject._id, amount);
    });

    plusButton.addEventListener('click', function(event) {
        addProduct(itemObject._id, amount);
    });
    document.getElementById("cart-container").append(clone);
}

function addProduct(id, amountParagraph) {
    let obj = sessionStorage.getItem(id);
    obj = JSON.parse(obj);
    obj.amount = parseInt(obj.amount) + 1;
    sessionStorage.setItem(id, JSON.stringify(obj));
    amountParagraph.innerHTML = obj.amount + "x";
}

function removeProduct(id, amountParagraph) {
    let obj = sessionStorage.getItem(id);
    obj = JSON.parse(obj);
    obj.amount = parseInt(obj.amount) - 1;
    if(obj.amount > 0) {
        sessionStorage.setItem(id, JSON.stringify(obj));
    } else {
        sessionStorage.removeItem(id);
        amountParagraph.parentNode.parentNode.removeChild(amountParagraph.parentNode);
    }
    amountParagraph.innerHTML = obj.amount + "x";
}

function placeOrder() {
    createNotification("Successfully created an order!", "notifications-container", true);
    removeElement("cart-container", "item-row");
    const divs = document.getElementsByClassName("item-row");
    for (d of divs) {
        d.parentNode.parentNode.removeChild(d.parentNode);
    }
    sessionStorage.clear();
}