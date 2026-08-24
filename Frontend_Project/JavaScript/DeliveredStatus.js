// URL 
const API_URL = "https://localhost:7299";

// Get delivery ID from the page URL
const params = new URLSearchParams(window.location.search);
const deliveryId = params.get("deliveryId");

// Get elements from the page
const confirmToggle = document.querySelector("#delivery-confirm-toggle");
const currentStatus = document.querySelector(".onway-status");

// Listen for the driver confirming the delivery
confirmToggle.addEventListener("change", async () => {
    // Do nothing if the checkbox is unchecked
    if (!confirmToggle.checked) {
        return;
    }
    // Make sure we have a delivery ID
    if (!deliveryId) {
        console.error("Delivery ID is missing.");

        confirmToggle.checked = false;

        alert("Delivery information is missing.");
        return;
    }
    try {
        // Send the new status to the backend
        const response = await fetch(
            `${API_URL}/delivery/${deliveryId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Delivered"
                })
            }
        );
        // Check HTTP status
        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            );
        }
        // Read backend JSON response
        const result = await response.json();

        console.log("Backend response:", result);
        // Check the result from the backend
        if (!result.success) {

            throw new Error(result.message);
        }
        // Update the status on the page
        currentStatus.textContent = "Delivered";

        // Show success message
        console.log(result.message);
        
    } catch (error) {

        console.error("Failed to mark delivery as delivered:", error);

        confirmToggle.checked = false;

        alert("Failed to mark the order as delivered.");
    }
});
