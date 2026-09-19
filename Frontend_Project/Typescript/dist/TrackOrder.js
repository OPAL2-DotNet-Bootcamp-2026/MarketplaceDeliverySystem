"use strict";
// =====================================================
// TRACK ORDER
// TypeScript version of TrackOrder.js
// =====================================================
// Driver modal
const driverModal = document.getElementById("driver-modal");
const closeDriverModal = document.getElementById("close-driver-modal");
const modalDriverName = document.getElementById("modal-driver-name");
const modalDriverPhone = document.getElementById("modal-driver-phone");
let currentOrders = [];
// orderStatuses stores information for every status
const orderStatuses = {
    placed: {
        badge: "ORDER RECEIVED",
        title: "Your order has been received",
        description: "We've received your order and it is being prepared.",
        statusText: "Order Placed",
        showDriverButton: false
    },
    ready: {
        badge: "ORDER READY",
        title: "Your order is ready",
        description: "We're waiting for a driver to pick up your order.",
        statusText: "Order Ready",
        showDriverButton: false
    },
    onway: {
        badge: "ON THE WAY",
        title: "Your order is on the way!",
        description: "A driver has been assigned to your order and is currently delivering it.",
        statusText: "On the Way",
        showDriverButton: true
    },
    delivered: {
        badge: "DELIVERED",
        title: "Your order has been delivered",
        description: "Your order has been successfully delivered. Enjoy your purchase!",
        statusText: "Delivered",
        showDriverButton: false
    }
};
function convertStatus(status) {
    switch (status.toLowerCase()) {
        case "pending":
            return "placed";
        case "ready":
            return "ready";
        case "on the way":
            return "onway";
        case "delivered":
            return "delivered";
        default:
            return null;
    }
}
// Driver information modal
function showDriverInformation(order) {
    if (!order.driverName || !order.driverPhone) {
        alert("No driver has been assigned to this order.");
        return;
    }
    if (!modalDriverName || !modalDriverPhone || !driverModal) {
        console.error("Driver modal elements were not found.");
        return;
    }
    modalDriverName.textContent = order.driverName;
    modalDriverPhone.textContent = order.driverPhone;
    driverModal.classList.add("show");
}
// Close modal
if (closeDriverModal && driverModal) {
    closeDriverModal.addEventListener("click", function () {
        driverModal.classList.remove("show");
    });
}
// Close when clicking outside the modal
if (driverModal) {
    driverModal.addEventListener("click", function (event) {
        if (event.target === driverModal) {
            driverModal.classList.remove("show");
        }
    });
}
async function loadOrders() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        return;
    }
    try {
        // Get currently active orders
        const activeResponse = await fetch("https://localhost:7299/api/Order/GetMyActiveOrders", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!activeResponse.ok) {
            throw new Error(`Request failed with status ${activeResponse.status}`);
        }
        const activeOrders = await activeResponse.json();
        currentOrders = activeOrders;
        renderOrders(activeOrders);
    }
    catch (error) {
        console.error("Failed to load orders:", error);
    }
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
function renderOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    if (!ordersContainer) {
        console.error("orders-container was not found.");
        return;
    }
    ordersContainer.innerHTML = "";
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <p class="no-orders">
                You have no active or recent orders.
            </p>
        `;
        return;
    }
    orders.forEach((order) => {
        const statusKey = convertStatus(order.orderStatus);
        if (!statusKey) {
            return;
        }
        const status = orderStatuses[statusKey];
        // Determine which progress step is current
        let currentStep = 1;
        if (statusKey === "ready") {
            currentStep = 2;
        }
        if (statusKey === "onway") {
            currentStep = 3;
        }
        if (statusKey === "delivered") {
            currentStep = 4;
        }
        // Progress step classes
        const step1Class = currentStep > 1
            ? "completed"
            : currentStep === 1
                ? "current"
                : "";
        const step2Class = currentStep > 2
            ? "completed"
            : currentStep === 2
                ? "current"
                : "";
        const step3Class = currentStep > 3
            ? "completed"
            : currentStep === 3
                ? "current"
                : "";
        const step4Class = currentStep === 4
            ? "current"
            : "";
        // Progress line classes
        const line1Class = currentStep > 1
            ? "completed-line"
            : "";
        const line2Class = currentStep > 2
            ? "completed-line"
            : "";
        const line3Class = currentStep > 3
            ? "completed-line"
            : currentStep === 3
                ? "active-line"
                : "";
        // Driver button
        const driverButton = status.showDriverButton
            ? `
            <button
                    class="view-driver-btn"
                    data-order-id="${order.orderId}">
                    View Driver Information
                </button>
            `
            : "";
        const orderCard = document.createElement("div");
        orderCard.className = "tracking-card";
        orderCard.innerHTML = `
            <!-- Order Header -->
            <div class="order-card-header">
                <span>Order</span>
                <strong>#${order.orderId}</strong>
                <span class="order-separator">•</span>
                <span>Placed</span>
                <strong>
                    ${formatDate(order.orderDate)}
                </strong>
            </div>

            <!-- Progress -->
            <div class="progress-container">
                <div class="progress-step ${step1Class}">
                    <div class="step-circle">
                        ${currentStep > 1 ? "✓" : "1"}
                    </div>
                    <span>Order Placed</span>
                </div>

                <div class="progress-line ${line1Class}"></div>

                <div class="progress-step ${step2Class}">
                    <div class="step-circle">
                        ${currentStep > 2 ? "✓" : "2"}
                    </div>
                    <span>Order Ready</span>
                </div>
                <div class="progress-line ${line2Class}"></div>

                <div class="progress-step ${step3Class}">
                    <div class="step-circle">
                        ${currentStep > 3 ? "✓" : "3"}
                    </div>
                    <span>On the Way</span>
                </div>

                <div class="progress-line ${line3Class}"></div>

                <div class="progress-step ${step4Class}">
                    <div class="step-circle">
                        4
                    </div>
                    <span>Delivered</span>
                </div>
            </div>

            <!-- Current Status -->
            <div class="current-status">
                <div class="delivery-icon">
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true">
                        <path d="M3 7h11v10H3z"></path>
                        <path d="M14 10h4l3 3v4h-7z"></path>
                        <circle cx="7" cy="19" r="1.5"></circle>
                        <circle cx="18" cy="19" r="1.5"></circle>
                    </svg>
                </div>

                <span class="status-badge">
                    ${status.badge}
                </span>

                <h2>
                    ${status.title}
                </h2>
                <p>
                    ${status.description}
                </p>

                <!-- Order Status Information -->
                <div class="delivery-time">
                    <div>
                        <span>
                            BUSINESS
                        </span>
                        <strong>
                            ${order.businessName}
                        </strong>
                    </div>

                    <div>
                        <span>
                            STATUS
                        </span>
                        <strong>
                            ${status.statusText}
                        </strong>
                    </div>
                </div>

                ${driverButton}
            </div>
        `;
        ordersContainer.appendChild(orderCard);
    });
    attachDriverButtons();
}
function attachDriverButtons() {
    const driverButtons = document.querySelectorAll(".view-driver-btn");
    driverButtons.forEach((button) => {
        const orderId = Number(button.dataset.orderId);
        button.addEventListener("click", function () {
            const order = currentOrders.find((order) => order.orderId === orderId);
            if (order) {
                showDriverInformation(order);
            }
        });
    });
}
// Start
loadOrders();
