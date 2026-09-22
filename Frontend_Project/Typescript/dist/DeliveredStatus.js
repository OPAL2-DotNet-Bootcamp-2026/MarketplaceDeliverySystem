"use strict";
//base URL of the backend
// Instead of writing: https://localhost:7299/delivery/my-delivery, 
// we can just write: `${API_URL}/delivery/my-delivery` and it will be replaced with the full URL.
const API_URL = "https://localhost:7299";
//Getting the login token (Get the authentication token that was saved in the browser.)
// 1. when the user logged in, the application stored the JWT token in localStorage with the key "authToken".
// 2. we retrieve that token from localStorage to use it for authentication in our API requests.
// null when the token is not found in localStorage, meaning the user is not logged in or the token has expired.
const token = localStorage.getItem("authToken");
// Getting the HTML elements:
// This searches your HTML for: <input id="delivery-confirm-toggle">
// hidden checkbox input that the driver can toggle to confirm delivery
//Because it is an <input>, we tell TypeScript:<HTMLInputElement>
const confirmToggle = document.querySelector("#delivery-confirm-toggle");
//This looks for something like:<strong class="onway-status">
//To display the current status of the delivery (e.g., "On the Way", "Delivered")
//later: currentStatus.textContent = "Delivered";
const currentStatus = document.querySelector(".onway-status");
// This looks for something like:<h2>#ORD-12345</h2>
// Later we change it to the current order number 
const orderNumber = document.querySelector(".delivery-order-info h2");
//deliveryId = null: because we haven't loaded the delivery yet
let deliveryId = null;
// This looks for something like:<button id="next-delivery-button">Next Delivery</button>
// The button that the driver can click to move to the next delivery after marking the current one as delivered
const nextDeliveryButton = document.querySelector("#next-delivery-button");
// Get the driver's current delivery from the backend and display it on the page.
// async - await: because we are making an asynchronous HTTP request to the backend, and we want to wait for the response before continuing.
// promise: Your function waits for the backend:await fetch(...);
async function loadDelivery() {
    // Check if the driver is logged in
    if (!token) {
        // if token = null
        alert("Please login first.");
        return;
    }
    try {
        // Make a GET request to the backend to get the current delivery for the logged-in driver
        const response = await fetch(`${API_URL}/delivery/my-delivery`, {
            // Authorization header: we include the JWT token in the request headers to authenticate the driver
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        // If the response is not successful, throw an error with the status code
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        // Parse the JSON response from the backend into a Delivery object
        const delivery = await response.json();
        console.log("Current delivery:", delivery);
        // Store the delivery ID
        deliveryId = delivery.deliveryId;
        // Update order information
        if (orderNumber) {
            // Set the text content of the order number element to display the order ID in the format "#ORD-12345"
            orderNumber.textContent =
                `#ORD-${delivery.orderId}`;
        }
        // Update current status if delivery.orderStatus exists and currentStatus element is found
        if (delivery.orderStatus && currentStatus) {
            currentStatus.textContent =
                delivery.orderStatus;
        }
        // If any error occurs during the fetch request or processing, it will be caught here.
    }
    catch (error) {
        console.error("Failed to load delivery:", error);
        alert("Could not load your delivery.");
    }
}
// Mark delivery as Delivered
async function markAsDelivered() {
    //If loadDelivery() didn't find a deliveryId, it remains null
    if (!deliveryId) {
        alert("No delivery was found.");
        // Reset the toggle to unchecked if no delivery is found
        if (confirmToggle) {
            confirmToggle.checked = false;
        }
        return;
    }
    try {
        const response = await fetch(`${API_URL}/delivery/${deliveryId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status: "Delivered"
            })
        });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        console.log("Backend response:", result);
        if (!result.success) {
            throw new Error(result.message);
        }
        // Update the UI
        if (currentStatus) {
            currentStatus.textContent = "Delivered";
        }
        console.log(result.message);
    }
    catch (error) {
        console.error("Failed to mark delivery as delivered:", error);
        if (confirmToggle) {
            confirmToggle.checked = false;
        }
        if (error instanceof Error) {
            alert(error.message);
        }
        else {
            alert("Failed to mark delivery as delivered.");
        }
    }
}
// Load delivery when page opens
loadDelivery();
// Listen for driver confirmation
if (confirmToggle) {
    confirmToggle.addEventListener("change", async () => {
        if (!confirmToggle.checked) {
            return;
        }
        await markAsDelivered();
    });
}
// Move to next delivery
if (nextDeliveryButton) {
    nextDeliveryButton.addEventListener("click", () => {
        window.location.reload();
    });
}
