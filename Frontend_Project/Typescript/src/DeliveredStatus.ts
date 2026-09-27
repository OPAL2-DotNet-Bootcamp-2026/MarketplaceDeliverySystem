// When I receive a delivery from the backend,it should have these properties.
interface Delivery {
    deliveryId: number;
    orderId: number;
    orderStatus?: string; //The ? means optional, might exist or it might not llike "On the Way"
}

// This describes the response expected when the driver marks the delivery as delivered.
interface DeliveryResponse {
    success: boolean; // true if the delivery was marked as delivered successfully, false otherwise
    message: string; //"Order delivered successfully."
}
//base URL of the backend
// Instead of writing: https://localhost:7299/delivery/my-delivery, 
// we can just write: `${API_URL}/delivery/my-delivery` and it will be replaced with the full URL.
const API_URL = "https://localhost:7299";

//Getting the login token (Get the authentication token that was saved in the browser.)
// 1. when the user logged in, the application stored the JWT token in localStorage with the key "authToken".
// 2. we retrieve that token from localStorage to use it for authentication in our API requests.
// null when the token is not found in localStorage, meaning the user is not logged in or the token has expired.
const token: string | null = localStorage.getItem("authToken");

// Getting the HTML elements:

// This searches your HTML for: <input id="delivery-confirm-toggle">
// hidden checkbox input that the driver can toggle to confirm delivery
//Because it is an <input>, we tell TypeScript:<HTMLInputElement>
const confirmToggle =
    document.querySelector<HTMLInputElement>("#delivery-confirm-toggle");

//This looks for something like:<strong class="onway-status">
//To display the current status of the delivery (e.g., "On the Way", "Delivered")
//later: currentStatus.textContent = "Delivered";
const currentStatus =
    document.querySelector<HTMLElement>(".onway-status");

// This looks for something like:<h2>#ORD-12345</h2>
// Later we change it to the current order number 
const orderNumber =
    document.querySelector<HTMLElement>(".delivery-order-info h2");

//deliveryId = null: because we haven't loaded the delivery yet
let deliveryId: number | null = null;

// This looks for something like:<button id="next-delivery-button">Next Delivery</button>
// The button that the driver can click to move to the next delivery after marking the current one as delivered
const nextDeliveryButton =
    document.querySelector<HTMLButtonElement>("#next-delivery-button");


// Get the driver's current delivery from the backend and display it on the page.
// async - await: because we are making an asynchronous HTTP request to the backend, and we want to wait for the response before continuing.
// promise: Your function waits for the backend:await fetch(...);
async function loadDelivery(): Promise<void> {
    // Check if the driver is logged in
    if (!token) {
        // if token = null
        alert("Please login first.");
        return;
    }

    try {
        // Make a GET request to the backend to get the current delivery for the logged-in driver
        const response = await fetch(
            `${API_URL}/delivery/my-delivery`,
            {
                // Authorization header: we include the JWT token in the request headers to authenticate the driver
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        // If the response is not successful, throw an error with the status code
        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }
        // Parse the JSON response from the backend into a Delivery object
        //response.json() = takes the JSON sent by your backend and converts it into a TypeScript object
        //await = wait for the backend to send the response before continuing
        const delivery: Delivery = await response.json();

        console.log("Current delivery:", delivery);

        // Store the delivery ID
        deliveryId = delivery.deliveryId;

        // Update order information
        if (orderNumber) {
            // Set the text content of the order number element to display the order ID in the format "#ORD-12345"
            // means change the text inside that HTML element
            orderNumber.textContent =
                `#ORD-${delivery.orderId}`;
        }

        // Update current status if delivery.orderStatus exists and currentStatus element is found
        if (delivery.orderStatus && currentStatus) {
            currentStatus.textContent =
                delivery.orderStatus;
        }
        // If any error occurs during the fetch request or processing, it will be caught here.
    } catch (error: unknown) {

        console.error(
            "Failed to load delivery:",
            error
        );

        alert("Could not load your delivery.");
    }
}


// Mark delivery as Delivered
async function markAsDelivered(): Promise<void> {
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
        // Make a PUT request to the backend to update the delivery status to "Delivered"
        const response = await fetch(
            // I want to update the status of this delivery id 
            `${API_URL}/delivery/${deliveryId}/status`,
            {
                method: "PUT",

                headers: {
                    //The data I'm sending is in JSON format
                    "Content-Type": "application/json",
                    //sends the user's JWT token to the backend to determine if the user is authorized to mark the delivery as delivered
                    "Authorization": `Bearer ${token}`
                },
                // The body of the request contains the new status in JSON format
                body: JSON.stringify({
                    status: "Delivered"
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }
        // This part handles the response from the backend after sending the PUT request
        // The backend sends back JSON like { "success": true, "message": "Order delivered successfully." }
        const result: DeliveryResponse =
            await response.json();

        console.log("Backend response:", result);

        if (!result.success) {

            throw new Error(result.message);
        }

        // Update the UI
        if (currentStatus) {
            currentStatus.textContent = "Delivered";
        }

        console.log(result.message);

    } catch (error: unknown) {

        console.error(
            "Failed to mark delivery as delivered:",
            error
        );

        if (confirmToggle) {
            //Uncheck the checkbox if the delivery could not be marked as delivered
            // example: if the backend returned an error, we don't want the checkbox to stay checked because the delivery wasn't actually marked as delivered
            confirmToggle.checked = false;
        }
        // If the error is an object of the Error class, we can access its message property and display it in an alert to inform the user about what went wrong.
        if (error instanceof Error) {
            alert(error.message);
        } else {
            alert("Failed to mark delivery as delivered.");
        }
    }
}


// Load delivery when page opens
loadDelivery();


// Wait for the driver to interact with the confirmation switch. 
// When they turn it ON, mark the delivery as delivered
//if (confirmToggle): If the confirmation toggle exists in the HTML, continue.
if (confirmToggle) {
    //addEventListener(): Wait for the user to change the state of the confirmation toggle (checkbox). 
    // When they do, run the function that marks the delivery as delivered.
    confirmToggle.addEventListener(
        "change",
        async () => {

            if (!confirmToggle.checked) {
                return;
            }

            await markAsDelivered();
        }
    );
}


// Move to next delivery
if (nextDeliveryButton) {

    nextDeliveryButton.addEventListener(
        "click",
        () => {
            //window: browser window/page
            // location: the current URL of the page
            // reload(): refresh the page and start the process of loading the next delivery for the driver
            window.location.reload();
        }
    );
}