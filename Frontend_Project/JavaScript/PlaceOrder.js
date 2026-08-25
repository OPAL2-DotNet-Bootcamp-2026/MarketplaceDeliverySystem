const CREATE_ORDER_API = "https://localhost:7299/api/Order/CreateOrder";
const DELIVERY_FEE = 0.700;
const VAT_RATE = 0.05;

let cartItems = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    renderCartItems();
    updateOrderSummary();

    const placeOrderBtn = document.querySelector(".btn-place-order");
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", handlePlaceOrder);
    }
});

const PAYMENT_METHOD_LABELS = {
    cod: "Cash On Delivery",
    apple_pay: "Apple Pay",
    card: "Credit/Debit Card"
};

async function handlePlaceOrder(e) {
    e.preventDefault();

    if (cartItems.length === 0) {
        alert("Your cart is empty. Add some products before placing an order.");
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment_method"]:checked');
    if (!selectedPayment) {
        alert("Please select a payment method before placing your order.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to place an order.");
        window.location.href = "Login.html";
        return;
    }

    // Customer id isn't returned from login yet, so this falls back to the
    // same test account used across the app until that's wired up.
    const customerId = Number(localStorage.getItem("customerId")) || 1;
    const businessId = cartItems[0].businessId;
    const paymentMethod = PAYMENT_METHOD_LABELS[selectedPayment.value] || selectedPayment.value;

    const orderPayload = {
        customerId: customerId,
        businessId: businessId,
        paymentMethod: paymentMethod,
        orderItems: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    const placeOrderBtn = document.querySelector(".btn-place-order");
    const originalLabel = placeOrderBtn.textContent;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing order...";

    try {
        const response = await fetch(CREATE_ORDER_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("CreateOrder failed:", response.status, errorBody);
            alert("We couldn't place your order. Please review your cart and try again.");
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = originalLabel;
            return;
        }

        const result = await response.json();
        onOrderPlaced(result, paymentMethod);

    } catch (err) {
        console.error("Network error while placing order:", err);
        alert("Something went wrong while placing your order. Please check your connection and try again.");
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = originalLabel;
    }
}

function onOrderPlaced(result, paymentMethod) {
    localStorage.setItem("lastOrderId", result.orderId);
    localStorage.setItem("lastPaymentMethod", paymentMethod);
    localStorage.removeItem("orderCart");
    cartItems = [];

    const trackLink = document.querySelector(".btn-track-order");
    if (trackLink) trackLink.href = `DriverInfo.html?orderId=${result.orderId}`;

    const modal = document.getElementById("orderSuccessModal");
    if (modal) modal.classList.add("active");
}

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

    attachQuantityHandlers();
}

function attachQuantityHandlers() {
    document.querySelectorAll(".order-items .qty-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const row = e.currentTarget.closest(".item-row");
            const index = Number(row.getAttribute("data-index"));
            const delta = e.currentTarget.getAttribute("data-action") === "inc" ? 1 : -1;
            changeItemQuantity(index, delta);
        });
    });
}

function changeItemQuantity(index, delta) {
    const item = cartItems[index];
    if (!item) return;

    item.quantity += delta;

    // Dropping to zero removes the item instead of leaving a 0 qty row
    if (item.quantity < 1) {
        cartItems.splice(index, 1);
    }

    localStorage.setItem("orderCart", JSON.stringify(cartItems));
    renderCartItems();
    updateOrderSummary();
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
