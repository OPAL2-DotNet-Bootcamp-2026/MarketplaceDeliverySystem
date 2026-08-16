// JS-->Changes the status, colors, messages, and progress
// Find ALL elements with the class progress-step.
// Step 1 → Order Placed | Step 2 → Order Ready | Step 3 → On the Way | Step 4 → Delivered
const steps = document.querySelectorAll(".progress-step");
// Find all the progress lines
const lines = document.querySelectorAll(".progress-line");
// in html we have id="status-badge" JavaScript finds it by .getElementById
const statusBadge = document.getElementById("status-badge");
const statusTitle = document.getElementById("status-title");
const statusDescription = document.getElementById("status-description");
const currentStatusText = document.getElementById("current-status-text");
const driverButton = document.getElementById("driver-button");

// It stores information for every possible order status
const orderStatuses = {

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
// Updates the page based on the given status
function updateOrderStatus(status) {

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


        // Remove previous classes
        step.classList.remove(
            "completed",
            "current"
        );


        // Completed steps
        if (index < currentIndex) {

            step.classList.add("completed");

            circle.textContent = "✓";
        }


        // Current step
        else if (index === currentIndex) {

            step.classList.add("current");

            circle.textContent = index + 1;
        }


        // Future steps
        else {

            circle.textContent = index + 1;
        }

    });


    // Update lines
    lines.forEach((line, index) => {

        line.classList.remove(
            "completed-line",
            "active-line"
        );


        // Line before current step
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
//In your current JavaScript, you are using the status names through:
// Test the order status
updateOrderStatus("placed");
updateOrderStatus("ready");
updateOrderStatus("onway");
//updateOrderStatus("delivered");