getJSON("/api/products").then(products => {
    const template = document.getElementById("product-template");
    for (product of products) {
        const clone = template.content.cloneNode(true);
        const name = clone.querySelector("h3");
        const description = clone.querySelector("p");
        const price = clone.querySelectorAll("p")[1];
        const button = clone.querySelector("button");

        name.innerHTML = product.name;
        name.id = `name-${product._id}`

        description.innerHTML = product.description;
        description.id = `description-${product._id}`;

        price.innerHTML = product.price;
        price.id = `price-${product._id}`;

        button.id = `add-to-cart-${product._id}`;

        button.addEventListener('click', function(event) {
            addToCart(name.innerHTML);
        })

        const productContainer = document.getElementById("products-container");
        productContainer.append(clone);

    }

    
})

function addToCart(productName) {
    createNotification(`Added ${productName} to cart!`, "notifications-container", true);
}