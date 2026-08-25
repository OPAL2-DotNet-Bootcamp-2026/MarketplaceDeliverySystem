const ORDER_DETAILS_API = "https://localhost:7299/api/Order/GetOrderById";

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId") || localStorage.getItem("lastOrderId");

    if (!orderId) {
        showLoadError("No order selected. Place an order first or return to your <a href=\"OrderHistory.html\">Order History</a>.");
        return;
    }

    await loadOrderDetails(orderId);
});

async function loadOrderDetails(orderId) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${ORDER_DETAILS_API}/${orderId}`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });

        if (!response.ok) {
            throw new Error(`GetOrderById returned status ${response.status}`);
        }

        const order = await response.json();
        renderDeliveryStatus(order);
        renderOrderItems(order);
        renderTotal(order);

    } catch (err) {
        console.error("Failed to load order details:", err);
        showLoadError("We couldn't load this order right now. Please check your connection and try again.");
    }
}

function renderDeliveryStatus(order) {
    const infoBoxValues = document.querySelectorAll(".delivery-status .info-box .value");
    const driverValueEl = infoBoxValues[0];
    const phoneValueEl = infoBoxValues[1];

    if (!driverValueEl || !phoneValueEl) return;

    // The API doesn't hand a driver's name/phone to the customer yet, so
    // this shows a status-based message instead of faking contact details.
    switch (order.orderStatus) {
        case "On the Way":
            driverValueEl.textContent = "A driver is on the way";
            phoneValueEl.textContent = "Contact details will show once available";
            break;
        case "Delivered":
            driverValueEl.textContent = "Delivered";
            phoneValueEl.textContent = "—";
            break;
        default:
            driverValueEl.textContent = "Waiting for a driver to be assigned";
            phoneValueEl.textContent = "—";
    }
}

function renderOrderItems(order) {
    const list = document.querySelector(".order-items .item-list");
    if (!list) return;

    const products = order.products || [];

    if (products.length === 0) {
        list.innerHTML = `<p style="color:#9ca3af; padding:12px 0;">No items found for this order.</p>`;
        return;
    }

    list.innerHTML = products.map(product => `
        <li class="item-row">
            <div class="item-details">
                <img src="../assets/img/ProductThumbnail.png" alt="${product.productName}" class="item-thumb">
                <div class="item-text">
                    <h4>${product.productName}</h4>
                    <p class="category">Unit Price: ${Number(product.unitPrice).toFixed(3)} OMR</p>
                </div>
            </div>
            <div class="item-price-info">
                <span class="quantity-badge">${product.quantity}</span>
                <span class="price">${Number(product.subTotal).toFixed(3)} OMR</span>
            </div>
        </li>
    `).join("");
}

function renderTotal(order) {
    const totalPriceEl = document.querySelector(".total-section .total-price");
    if (totalPriceEl) {
        totalPriceEl.textContent = `${Number(order.totalAmount).toFixed(3)} OMR`;
    }

    const paymentMethodEl = document.querySelector(".total-section .payment-method");
    if (paymentMethodEl) {
        const paymentMethod = localStorage.getItem("lastPaymentMethod");
        paymentMethodEl.textContent = paymentMethod
            ? `Paid With ${paymentMethod}`
            : "Payment method on file";
    }
}

function showLoadError(message) {
    const main = document.querySelector("main.container");
    if (!main) return;

    main.insertAdjacentHTML("beforeend", `
        <div class="card">
            <p style="color:#dc2626; margin:0;">${message}</p>
        </div>
    `);
}
