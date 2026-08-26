const API_URL = "https://localhost:7299";

const token = sessionStorage.getItem("token");

const confirmToggle =
    document.querySelector("#delivery-confirm-toggle");

const currentStatus =
    document.querySelector(".onway-status");

const orderNumber =
    document.querySelector(".delivery-order-info h2");

let deliveryId = null;


// Get the driver's current delivery
async function loadDelivery() {

    if (!token) {
        alert("Please login first.");
        return;
    }
    

    try {

        const response = await fetch(
            `${API_URL}/delivery/my-delivery`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        const delivery = await response.json();

        console.log("Current delivery:", delivery);

        // Store the delivery ID
        deliveryId = delivery.deliveryId;

        // Update order information
        orderNumber.textContent =
            `#ORD-${delivery.orderId}`;

        // Update current status
        if (delivery.orderStatus) {
            currentStatus.textContent =
                delivery.orderStatus;
        }

    } catch (error) {

        console.error(
            "Failed to load delivery:",
            error
        );

        alert("Could not load your delivery.");
    }
}


// Mark delivery as Delivered
async function markAsDelivered() {

    if (!deliveryId) {

        alert("No delivery was found.");

        confirmToggle.checked = false;

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/delivery/${deliveryId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

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

        const result = await response.json();

        console.log("Backend response:", result);

        if (!result.success) {

            throw new Error(result.message);
        }

        // Update the UI
        currentStatus.textContent = "Delivered";

        console.log(result.message);

    } catch (error) {

        console.error(
            "Failed to mark delivery as delivered:",
            error
        );

        confirmToggle.checked = false;

        alert(error.message);
    }
}


// Load delivery when page opens
loadDelivery();


// Listen for driver confirmation
confirmToggle.addEventListener(
    "change",
    async () => {

        if (!confirmToggle.checked) {
            return;
        }

        await markAsDelivered();
    }
);