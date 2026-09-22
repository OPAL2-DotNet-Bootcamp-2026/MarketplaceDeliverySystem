// --- Interfaces ---

interface OrderDetails {
    orderId?: string | number;
    orderStatus: "Pending" | "Preparing" | "On the Way" | "Delivered" | "Cancelled" | string;
    driverName?: string | null;
    driverPhone?: string | null;
    [key: string]: unknown;
}

// --- Configuration ---

const ORDER_DETAILS_API: string = "https://localhost:7299/api/Order/GetOrderById";

// --- Main Handler ---

document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
    const driverName = document.getElementById("driver-name");
    const driverPhone = document.getElementById("driver-phone");

    // Guard: Ensure elements exist before attempting mutations
    if (!driverName || !driverPhone) {
        console.warn("Driver display elements were not found in the DOM.");
        return;
    }

    const orderId: string | null = localStorage.getItem("lastOrderId");
    const token: string | null = localStorage.getItem("authToken");

    // No logged-in user
    if (!token) {
        driverName.textContent = "Please login first";
        driverPhone.textContent = "—";
        return;
    }

    // No order found in storage
    if (!orderId) {
        driverName.textContent = "No current order";
        driverPhone.textContent = "—";
        return;
    }

    try {
        const response: Response = await fetch(`${ORDER_DETAILS_API}/${encodeURIComponent(orderId)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const order: OrderDetails = await response.json();

        // Active driver in transit
        if (order.orderStatus === "On the Way" && order.driverName && order.driverPhone) {
            driverName.textContent = order.driverName;
            driverPhone.textContent = order.driverPhone;
        } 
        // Order completed
        else if (order.orderStatus === "Delivered") {
            driverName.textContent = order.driverName ?? "Driver";
            driverPhone.textContent = order.driverPhone ?? "—";
        } 
        // Other statuses (Pending, Preparing, Cancelled, etc.)
        else {
            driverName.textContent = "No active driver";
            driverPhone.textContent = "—";
        }
    } catch (error: unknown) {
        console.error("Failed to load driver information:", error);
        driverName.textContent = "Unable to load driver";
        driverPhone.textContent = "—";
    }
});
