const ORDER_DETAILS_API =
    "https://localhost:7299/api/Order/GetOrderById";

document.addEventListener("DOMContentLoaded", async () => {

    const driverName =
        document.getElementById("driver-name");

    const driverPhone =
        document.getElementById("driver-phone");

    const orderId =
        localStorage.getItem("lastOrderId");

    const token =
        localStorage.getItem("authToken");


    // No logged-in user
    if (!token) {

        driverName.textContent =
            "Please login first";

        driverPhone.textContent =
            "—";

        return;
    }


    // No order
    if (!orderId) {

        driverName.textContent =
            "No current order";

        driverPhone.textContent =
            "—";

        return;
    }


    try {

        const response = await fetch(
            `${ORDER_DETAILS_API}/${orderId}`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `Request failed with status ${response.status}`
            );
        }


        const order =
            await response.json();


        // The SAME driver information
        // already used by TrackOrder
        if (
            order.orderStatus === "On the Way" &&
            order.driverName &&
            order.driverPhone
        ) {

            driverName.textContent =
                order.driverName;

            driverPhone.textContent =
                order.driverPhone;

        }

        else if (order.orderStatus === "Delivered") {

            driverName.textContent =
                order.driverName || "Driver";

            driverPhone.textContent =
                order.driverPhone || "—";

        }

        else {

            driverName.textContent =
                "No active driver";

            driverPhone.textContent =
                "—";
        }

    }

    catch (error) {

        console.error(
            "Failed to load driver information:",
            error
        );

        driverName.textContent =
            "Unable to load driver";

        driverPhone.textContent =
            "—";
    }

});