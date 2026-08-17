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
const driverButton = document.getElementById("driver-button");

// orderStatuses stores information for every statusc
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
//In your current JavaScript, you are using the status names through:
// Test the order status
updateOrderStatus("placed");
updateOrderStatus("ready");
updateOrderStatus("onway");
//updateOrderStatus("delivered");