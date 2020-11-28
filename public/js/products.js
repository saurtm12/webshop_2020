getJSON("/api/products").then(products => {
    const template = document.getElementById("product-template");
    products.map(product => {
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
        button.classList.add('addToCart-button');

        const id = product._id

        const passedProduct = {
            '_id': id,
            'name': name.innerHTML,
            'description': description.innerHTML,
            'price': price.innerHTML,
            'amount': null
        };

        button.addEventListener('click', function(event) {
            addToCart(name.innerHTML, id, passedProduct);
        })

        const productContainer = document.getElementById("products-container");
        productContainer.append(clone);
    });
})

/**
 * Add product to cart.
 *
 * @param {string} productName Name of the product
 * @param {string} productId ID of the product
 * @param {object} product Product object
 */
function addToCart(productName, productId, product) {
    createNotification(`Added ${productName} to cart!`, "notifications-container", true);
    let storageItem = sessionStorage.getItem(productId);
    storageItem = JSON.parse(storageItem);
    if (storageItem && storageItem.amount !== null) {
        product.amount = parseInt(storageItem.amount) + 1;
    } else {
        product.amount = 1;
    }
    
    sessionStorage.setItem(productId, JSON.stringify(product));
}
