//give orders
const loadOrders = async () => {
    const orderInfo = await getJSON("/api/orders");
    const ordersTemplate = document.getElementById("order-template");
    const productTemplate = document.getElementById("product-template");
    const orderContainer = document.getElementById("orders-container");

    orderInfo.forEach( item => {
        const cloneDiv = ordersTemplate.content.cloneNode(true);
        const orderRow = cloneDiv.querySelector(".order-row");

        orderRow.setAttribute("id", `order-${item._id}`);

        item.items.forEach( i => {
            console.log(i);
            const cloneDivProduct = productTemplate.content.cloneNode(true);
            const itemrow = cloneDivProduct.querySelector(".item-row");
            const productName = cloneDivProduct.querySelector(".product-name");
            const description = cloneDivProduct.querySelector(".product-description");
            const price = cloneDivProduct.querySelector(".product-price");
            const quantity = cloneDivProduct.querySelector(".product-quantity");

            const productInfo = i.product;
            itemrow.setAttribute("id", `product-${i._id}`);
            productName.setAttribute("id", `name-${i._id}`);
            description.setAttribute("id", `description-${i._id}`);
            price.setAttribute("id", `price-${i._id}`);
            quantity.setAttribute("id", `quantity-${i._id}`);

            productName.textContent = productInfo.name;
            description.textContent = productInfo.description;
            price.textContent = productInfo.price;
            quantity.textContent = i.quantity;

            orderRow.appendChild(itemrow);
        });
        orderContainer.appendChild(cloneDiv);
    });
};

(async function () {
    loadOrders();
})();