/**
 * Event handler when an admin add a new product to the system
 */
document.getElementById("addProductButton").addEventListener("click", event => {
    event.preventDefault();
    const name = document.querySelector("#name").value;
    const image = document.querySelector("#image").value;
    const description = document.querySelector("#description").value;
    const price = document.querySelector("#price").value;

    if (Number(price) <= 0) {
        return createNotification("Price is invalid", "notifications-container", false);
    };
    
    if (!image.match( /(http|https):\/\/\S+\.\S+\/?\S*/ ) ) {
        return createNotification("Invalid image url", "notifications-container", false);
    }

    const newProduct = {
        name: name,
        description: description,
        image: image,
        price: Number(price)
    };
    postOrPutJSON("/api/products", "POST", JSON.stringify(newProduct)).then(response => {
        console.log(response);
        if (!response) {
            createNotification("Add product success", "notifications-container", true);
            document.querySelector("#product-form").reset();
        }
    })
})