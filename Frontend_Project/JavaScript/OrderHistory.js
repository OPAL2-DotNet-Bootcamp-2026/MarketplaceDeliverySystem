console.log("OrderHistory.js is working");

// =====================================================
// API
// =====================================================

const API_URL =
    "https://localhost:7299/api/Customer/ViewOrderHistory";


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Order History page loaded");

    loadOrderHistory();

});


// =====================================================
// LOAD ORDER HISTORY
// =====================================================

async function loadOrderHistory() {

    try {

        // -----------------------------------------
        // 1. Get JWT token
        // -----------------------------------------

        const token =
            localStorage.getItem("authToken");

        console.log("Token:", token);


        // -----------------------------------------
        // 2. Check token
        // -----------------------------------------

        if (!token) {

            console.error("No login token found");

            showMessage(
                "Please login first."
            );

            return;
        }


        // -----------------------------------------
        // 3. Get Customer ID from JWT
        // -----------------------------------------

       /* const customerId =
            getCustomerIdFromToken(token);*/

            const customerId = 2;

        console.log(
            "Customer ID:",
            customerId
        );


        // -----------------------------------------
        // 4. Check Customer ID
        // -----------------------------------------

        if (!customerId) {

            console.error(
                "Customer ID was not found inside JWT."
            );

            showMessage(
                "Unable to identify the logged-in customer."
            );

            return;
        }


        // -----------------------------------------
        // 5. Build API URL
        // -----------------------------------------

        const url =
            `${API_URL}/${customerId}`;

        console.log(
            "Calling API:",
            url
        );


        // -----------------------------------------
        // 6. Call Backend
        // -----------------------------------------

        const response =
            await fetch(url, {

                method: "GET",

                headers: {

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            });


        // -----------------------------------------
        // 7. Check response
        // -----------------------------------------

        console.log(
            "Response status:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "API Error:",
                errorText
            );

            showMessage(
                "Unable to load your orders."
            );

            return;
        }


        // -----------------------------------------
        // 8. Read data
        // -----------------------------------------

        const data =
            await response.json();

        console.log(
            "Orders received:",
            data
        );


        // -----------------------------------------
        // 9. Display orders
        // -----------------------------------------

        displayOrders(data);


    } catch (error) {

        console.error(
            "Order History Error:",
            error
        );

        showMessage(
            "Cannot connect to the server."
        );

    }

}


// =====================================================
// GET CUSTOMER ID FROM JWT
// =====================================================

function getCustomerIdFromToken(token) {

    try {

        const parts =
            token.split(".");

        if (parts.length !== 3) {

            console.error(
                "Invalid JWT token."
            );

            return null;
        }


        // Decode JWT payload

        const payload =
            parts[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        const decodedPayload =
            decodeURIComponent(
                atob(payload)
                    .split("")
                    .map(function (character) {

                        return "%" +
                            (
                                "00" +
                                character
                                    .charCodeAt(0)
                                    .toString(16)
                            ).slice(-2);

                    })
                    .join("")
            );


        const claims =
            JSON.parse(decodedPayload);


        console.log(
            "JWT Claims:",
            claims
        );


        // -----------------------------------------
        // Try common claim names
        // -----------------------------------------

        return (

            claims.customerId ||

            claims.CustomerId ||

            claims.customerID ||

            claims.userId ||

            claims.UserId ||

            claims.sub ||

            claims.nameid ||

            claims[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]

        );


    } catch (error) {

        console.error(
            "Cannot decode JWT:",
            error
        );

        return null;
    }

}


// =====================================================
// DISPLAY ORDERS
// =====================================================

function displayOrders(data) {

    const container =
        document.getElementById(
            "orders-container"
        );


    if (!container) {

        console.error(
            "orders-container not found."
        );

        return;
    }


    container.innerHTML = "";


    // -----------------------------------------
    // Make sure we have an array
    // -----------------------------------------

    let orders = data;


    // Sometimes API returns:
    // { data: [...] }

    if (!Array.isArray(orders)) {

        if (Array.isArray(data.data)) {

            orders = data.data;

        } else if (Array.isArray(data.orders)) {

            orders = data.orders;

        } else {

            orders = [];
        }
    }


    // -----------------------------------------
    // No orders
    // -----------------------------------------

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="no-orders">
                <h3>No orders found</h3>
                <p>You don't have any orders yet.</p>
            </div>
        `;

        return;
    }


    // -----------------------------------------
    // Display orders
    // -----------------------------------------

    orders.forEach(function (order) {

        const orderElement =
            document.createElement("div");

        orderElement.className =
            "order-card";


        orderElement.innerHTML = `

            <div class="order-header">

                <h3>
                    Order #${order.orderId ?? order.id ?? ""}
                </h3>

                <span>
                    ${order.status ?? "Unknown"}
                </span>

            </div>


            <div class="order-details">

                <p>
                    <strong>Date:</strong>
                    ${order.orderDate ?? order.date ?? ""}
                </p>

                <p>
                    <strong>Total:</strong>
                    ${order.totalAmount ?? order.total ?? ""}
                </p>

            </div>

        `;


        container.appendChild(
            orderElement
        );

    });

}


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(message) {

    const container =
        document.getElementById(
            "orders-container"
        );


    if (!container) {

        return;
    }


    container.innerHTML = `

        <div class="order-message">

            <p>${message}</p>

        </div>

    `;
}