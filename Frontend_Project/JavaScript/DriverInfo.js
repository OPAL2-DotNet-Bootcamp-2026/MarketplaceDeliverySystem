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
        console.log("Order details loaded:", order);

    } catch (err) {
        console.error("Failed to load order details:", err);
        showLoadError("We couldn't load this order right now. Please check your connection and try again.");
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
