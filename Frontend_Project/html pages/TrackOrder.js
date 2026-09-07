// JS-->Changes the status, colors, messages, and progress
// Find ALL elements with the class progress-step(contains all 4 steps).
// Step 1 → Order Placed | Step 2 → Order Ready | Step 3 → On the Way | Step 4 → Delivered
const steps = document.querySelectorAll(".progress-step");
// Find all the progress lines between the steps.
const lines = document.querySelectorAll(".progress-line");
// in html we have id="status-badge" JavaScript finds it by .getElementById
const statusBadge = document.getElementById("status-badge");
//need these elements to change them later.
const statusTitle = document.getElementById("status-title");
const statusDescription = document.getElementById("status-description");
const currentStatusText = document.getElementById("current-status-text");
const deliveryStatusText = document.getElementById("delivery-status-text");
const driverButton = document.getElementById("driver-button");

// Dynamic order information
const orderNumber =
    document.getElementById("order-number");

const orderDate =
    document.getElementById("order-date");

const orderNumberDetails =
    document.getElementById("order-number-details");

const orderItems =
    document.getElementById("order-items");

const orderTotal =
    document.getElementById("order-total");

const driverStatus =
    document.getElementById("driver-status");

// Driver modal
const driverModal =
    document.getElementById("driver-modal");

const closeDriverModal =
    document.getElementById("close-driver-modal");

const modalDriverName =
    document.getElementById("modal-driver-name");

const modalDriverPhone =
    document.getElementById("modal-driver-phone");

// Store the current order
let currentOrder = null;

// orderStatuses stores information for every status
const orderStatuses = {
    //this is as a dictionary of order information.
    placed: {
        badge: "ORDER RECEIVED",

        title: "Your order has been received",

        description:
            "We've received your order and it is being prepared.",

        statusText: "Order Placed",

        showDriverButton: false
    },


    ready: {
        badge: "ORDER READY",

        title: "Your order is ready",

        description:
            "We're waiting for a driver to pick up your order.",

        statusText: "Order Ready",

        showDriverButton: false
    },


    onway: {
        badge: "ON THE WAY",

        title: "Your order is on the way!",

        description:
            "A driver has been assigned to your order and is currently delivering it.",

        statusText: "On the Way",
        //when the order is on the way, the customer can view the driver.
        showDriverButton: true
    },


    delivered: {
        badge: "DELIVERED",

        title: "Your order has been delivered",

        description:
            "Your order has been successfully delivered. Enjoy your purchase!",

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
// Updates the page based on the given order status
function updateOrderStatus(status) {
    //This tells JavaScript: The current step is step number?
    const statusIndex = {
        placed: 0,
        ready: 1,
        onway: 2,
        delivered: 3
    };

    const currentIndex = statusIndex[status];


    // Update all the steps = Go through every step one by one.
    steps.forEach((step, index) => {
        // Finding the circle inside each step
        const circle = step.querySelector(".step-circle");


        // Before adding the new status, remove the old status styles
        // It removes CSS classes from an HTML element to can determine the current class
        step.classList.remove(
            "completed",
            "current"
        );


        // Completed steps
        //If this step comes before the current step, mark it as completed
        if (index < currentIndex) {
            //JavaScript adds: class="completed"
            step.classList.add("completed");

            circle.textContent = "✓";
            //Then the CSS will change it to green(the completed circle becomes teal)
        }


        // Current step
        else if (index === currentIndex) {
            //JavaScript adds: class="current"
            step.classList.add("current");
            //to write the number inside the circle
            circle.textContent = index + 1;

        }


        // Future steps
        //If the step is after the current step, it is still in the future
        else {

            circle.textContent = index + 1;
        }

    });


    // Update lines
    //JavaScript goes through each line
    lines.forEach((line, index) => {
        //It removes any old line styles
        line.classList.remove(
            "completed-line",
            "active-line"
        );


        // Line before current step(completed line)
        if (index < currentIndex) {

            line.classList.add(
                "completed-line"
            );

        }

        // Line leading to current step
        else if (index === currentIndex) {

            line.classList.add(
                "active-line"
            );

        }

    });


    // Update message
    const data = orderStatuses[status];
    //change its text JavaScript can change: ON THE WAY to DELIVERED without manually changing the HTML
    statusBadge.textContent = data.badge;

    statusTitle.textContent = data.title;

    statusDescription.textContent =
        data.description;

    currentStatusText.textContent =
        data.statusText;


    // Driver button
    if (data.showDriverButton) {

        driverButton.style.display =
            "inline-block";

    } else {

        driverButton.style.display =
            "none";

    }

}
// =========================
// DRIVER INFORMATION MODAL
// =========================

function showDriverInformation(order) {

    if (!order.driverName || !order.driverPhone) {

        alert("No driver has been assigned to this order.");

        return;
    }

    modalDriverName.textContent =
        order.driverName;

    modalDriverPhone.textContent =
        order.driverPhone;

    driverModal.classList.add("show");
}


// Close modal
closeDriverModal.addEventListener(
    "click",
    function () {

        driverModal.classList.remove("show");

    }
);


// Close when clicking outside the modal
driverModal.addEventListener(
    "click",
    function (event) {

        if (event.target === driverModal) {

            driverModal.classList.remove("show");

        }

    }
);


// View Driver Information button
driverButton.addEventListener(
    "click",
    function () {

        if (currentOrder) {

            showDriverInformation(currentOrder);

        }

    }
);

async function loadOrder() {

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("orderId");

    if (!orderId) {

        statusBadge.textContent =
            "ERROR";

        statusTitle.textContent =
            "Order information is missing";

        statusDescription.textContent =
            "We could not find the order you are trying to track.";

        return;
    }

    const token =
        sessionStorage.getItem("token");

    if (!token) {

        statusBadge.textContent =
            "LOGIN REQUIRED";

        statusTitle.textContent =
            "Please login first";

        statusDescription.textContent =
            "You need to login to view your order.";

        driverButton.style.display =
            "none";

        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7299/api/Order/GetOrderById/${orderId}`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            if (response.status === 401) {
                throw new Error(
                    "Please login to view this order."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    "You are not allowed to view this order."
                );
            }

            if (response.status === 404) {
                throw new Error(
                    "Order not found."
                );
            }

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        const order =
            await response.json();

        console.log(
            "Order received:",
            order
        );

        currentOrder = order;
        // -------------------------
        // Order information
        // -------------------------

        orderNumber.textContent =
            `#ORD-${order.orderId}`;

        orderNumberDetails.textContent =
            `#ORD-${order.orderId}`;

        orderDate.textContent =
            formatDate(order.orderDate);

        orderTotal.textContent =
            `${Number(order.totalAmount).toFixed(3)} OMR`;


        // -------------------------
        // Items
        // -------------------------

        const products =
            order.products || [];

        orderItems.textContent =
            `${products.length} Items`;


        // -------------------------
        // Driver status
        // -------------------------

        if (
            order.orderStatus === "On the Way" ||
            order.orderStatus === "Delivered"
        ) {

            driverStatus.textContent =
                "Assigned";

        } else {

            driverStatus.textContent =
                "Not Assigned";
        }


        // -------------------------
        // Order progress
        // -------------------------

        const frontendStatus =
            convertStatus(order.orderStatus);

        if (!frontendStatus) {

            throw new Error(
                `Unknown order status: ${order.orderStatus}`
            );
        }


        // Update delivery status text

        deliveryStatusText.textContent =
            order.orderStatus;


        // Update progress UI

        updateOrderStatus(
            frontendStatus
        );

    } catch (error) {

        console.error(
            "Failed to load order:",
            error
        );

        statusBadge.textContent =
            "ERROR";

        statusTitle.textContent =
            "Unable to load your order";

        statusDescription.textContent =
            error.message;

        currentStatusText.textContent =
            "Unavailable";

        deliveryStatusText.textContent =
            "Unavailable";

        driverButton.style.display =
            "none";
    }
}
function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}
loadOrder();
