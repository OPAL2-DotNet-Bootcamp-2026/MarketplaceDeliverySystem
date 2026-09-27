// Get the customer's active orders from the backend, 
// determine each order's status, display its progress, and show driver information when available.
// =====================================================
// TRACK ORDER
// TypeScript version of TrackOrder.js
// =====================================================

// what an order object should look like
interface Order {
    orderId: number;
    orderDate: string;
    orderStatus: string;
    businessName: string;
    driverName?: string | null;
    driverPhone?: string | null;
}

//This defines the information that the page needs to display for each order status
interface OrderStatusInfo {
    badge: string;
    title: string;
    description: string;
    statusText: string;
    showDriverButton: boolean;
}
//OrderStatusKey can only be one of these four values
type OrderStatusKey = "placed" | "ready" | "onway" | "delivered";

// Driver modal (popup window that appears for the driver information)
const driverModal = document.getElementById("driver-modal");
const closeDriverModal = document.getElementById("close-driver-modal");
const modalDriverName = document.getElementById("modal-driver-name");
const modalDriverPhone = document.getElementById("modal-driver-phone");

// This creates an empty array that will eventually store the customer's orders.
let currentOrders: Order[] = [];

// orderStatuses stores information for every status in a dictionary-like format, 
// where the key is the status and the value is an object containing the information for that status.
const orderStatuses: Record<OrderStatusKey, OrderStatusInfo> = {
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

function convertStatus(status: string): OrderStatusKey | null {
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
function showDriverInformation(order: Order): void {
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

// Close modal: If the Close button exists AND the modal exists
if (closeDriverModal && driverModal) {
    // Wait for the user to click the Close button: When the user clicks the Close button, run the code
    closeDriverModal.addEventListener("click", function () {
        //CSS no longer applies the show style, so the modal disappears
        // before: <div id="driver-modal" class="show">
        // after: <div id="driver-modal">
        driverModal.classList.remove("show");
    });
}

// Close when clicking outside the modal
if (driverModal) {
    driverModal.addEventListener("click", function (event: MouseEvent) {
        // Did the user click the modal's background itself?
        if (event.target === driverModal) {
            driverModal.classList.remove("show");
        }
    });
}

async function loadOrders(): Promise<void> {
    // This looks inside the browser's localStorage for something called authToken
    const token = localStorage.getItem("authToken");

    if (!token) {
        return;
    }
    try {
        // Get currently active orders
        const activeResponse = await fetch(
            "https://localhost:7299/api/Order/GetMyActiveOrders",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!activeResponse.ok) {
            throw new Error(
                `Request failed with status ${activeResponse.status}`
            );
        }
        // The response from the backend is converted to JSON and stored in the activeOrders variable, which is an array of Order objects.
        const activeOrders = await activeResponse.json() as Order[];

        currentOrders = activeOrders;
        //Display the orders
        renderOrders(activeOrders);
    } catch (error) {
        // Show the error in F12 Console
        console.error("Failed to load orders:", error);
    }
}

//change the date into a nicer format
function formatDate(dateString: string): string {
    //Convert the string into a Date
    const date = new Date(dateString);
    ////Format this date using the English (US) date style.
    return date.toLocaleDateString("en-US", {
        //Choose how to display it:
        month: "short", //sep
        day: "numeric", //27
        year: "numeric" //2026
    });
}

//main function that creates and displays all the orders on the Track Order page.
function renderOrders(orders: Order[]): void {
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

    //order: Order --> represents one order at a time
    orders.forEach((order: Order) => {
        const statusKey = convertStatus(order.orderStatus);

        if (!statusKey) {
            return;
        }

        const status = orderStatuses[statusKey];

        // Determine which progress step is current
        let currentStep = 1; //means the order has been placed
        // If the order is ready, on the way, or delivered, update currentStep accordingly
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
                : ""; //means no class

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
        //Create a new HTML <div> element
        const orderCard = document.createElement("div");
        //Give it a CSS class
        //The tracking-card class allows your CSS to style the order card.
        orderCard.className = "tracking-card";

        //Put this HTML code inside the <div>
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
        //Put the order card inside the orders container on the webpage
        ordersContainer.appendChild(orderCard);
    });

    attachDriverButtons();
}

function attachDriverButtons(): void {
    // Find all driver buttons
    // in some cases will have multiple orders, so we need to find all buttons
    const driverButtons = document.querySelectorAll(".view-driver-btn");
    // Take each driver button one at a time 
    driverButtons.forEach((button: Element) => {
        // Get the orderId from the button's data attribute each button looks like:
        // <button
        //class="view-driver-btn"
        //data-order-id="${order.orderId}">
        //View Driver Information
        //</button>
        const orderId = Number(
            (button as HTMLElement).dataset.orderId
        );
        // When the user clicks the button, run this code
        // Find the matching order
        button.addEventListener("click", function () {
            const order = currentOrders.find(
                (order: Order) => order.orderId === orderId
            );

            if (order) {
                showDriverInformation(order);
            }
        });
    });
}

// Start
loadOrders();