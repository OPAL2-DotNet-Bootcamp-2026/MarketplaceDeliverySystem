const CREATE_ORDER_API = "https://localhost:7299/api/Order/CreateOrder";
const DELIVERY_FEE = 0.700;
const VAT_RATE = 0.05;

let cartItems = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    renderCartItems();
    updateOrderSummary();
});

function loadCartFromStorage() {
    cartItems = JSON.parse(localStorage.getItem("orderCart") || "[]");
}

function renderCartItems() {
    const list = document.querySelector(".order-items .item-list");
    const heading = document.querySelector(".order-items .card-header h2");

    if (!list) return;

    if (cartItems.length === 0) {
        list.innerHTML = `
            <p class="empty-cart-msg">
                Your cart is empty. Head back to <a href="Products.html">Products</a> to add some items.
            </p>
        `;
        if (heading) heading.textContent = "ORDER ITEMS (0)";
        return;
    }

    if (heading) heading.textContent = `ORDER ITEMS (${cartItems.length})`;

    list.innerHTML = cartItems.map((item, index) => {
        const lineTotal = (item.price * item.quantity).toFixed(3);

        return `
            <li class="item-row" data-index="${index}">
                <div class="item-details">
                    <img src="${item.imageUrl}" alt="${item.productName}" class="item-thumb">
                    <div class="item-text">
                        <h4>${item.productName}</h4>
                        <p class="category">Category: Food & Beverage</p>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-picker">
                        <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
                    </div>
                    <span class="price">${lineTotal} OMR</span>
                </div>
            </li>
        `;
    }).join("");
}

function updateOrderSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = subtotal * VAT_RATE;
    const total = subtotal + DELIVERY_FEE + vat;

    const summaryRows = document.querySelectorAll(".summary-breakdown .summary-row .value");
    if (summaryRows[0]) summaryRows[0].textContent = `${subtotal.toFixed(3)} OMR`;
    if (summaryRows[1]) summaryRows[1].textContent = `${DELIVERY_FEE.toFixed(3)} OMR`;
    if (summaryRows[2]) summaryRows[2].textContent = `${vat.toFixed(3)} OMR`;

    const totalPriceEl = document.querySelector(".summary-row.total-row .total-price");
    if (totalPriceEl) totalPriceEl.textContent = `${total.toFixed(3)} OMR`;

    const placeOrderBtn = document.querySelector(".btn-place-order");
    if (placeOrderBtn) placeOrderBtn.textContent = `Place Order (${total.toFixed(3)} OMR)`;
}
