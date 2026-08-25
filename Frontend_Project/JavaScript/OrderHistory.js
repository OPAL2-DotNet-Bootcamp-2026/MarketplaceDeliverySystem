console.log("Order History JS is working");

// =====================================================
// Get Customer ID from JWT Token
// =====================================================

function getCustomerIdFromToken(token) {

    try {

        // JWT format:
        // Header.Payload.Signature

        const payload = token.split(".")[1];

        // Decode the Payload
        const decodedPayload = JSON.parse(
            atob(payload)
        );

        console.log("JWT Payload:", decodedPayload);


        // Get Customer ID
        const customerId =
            decodedPayload.customerId ||
            decodedPayload.userId ||
            decodedPayload.sub ||
            decodedPayload.nameid ||
            decodedPayload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];


        return customerId;

    }

    catch (error) {

        console.error(
            "Could not read Customer ID from JWT:",
            error
        );

        return null;
    }
}



// =====================================================
// Load Order History
// =====================================================

async function loadOrderHistory() {


    // -----------------------------------------
    // 1. Get JWT Token
    // -----------------------------------------

    const token =
        localStorage.getItem("token");


    console.log("Token:", token);


    if (!token) {

        console.error(
            "JWT token was not found in localStorage."
        );

        return;
    }


    // -----------------------------------------
    // 2. Get Customer ID from JWT
    // -----------------------------------------

    const customerId =
        getCustomerIdFromToken(token);


    console.log(
        "Current Customer ID:",
        customerId
    );


    if (!customerId) {

        console.error(
            "Customer ID was not found in JWT."
        );

        return;
    }


    // -----------------------------------------
    // 3. API URL
    // -----------------------------------------

    const url =
        `https://localhost:7299/api/Customer/ViewOrderHistory/${customerId}`;


    console.log(
        "API URL:",
        url
    );


    try {


        // -----------------------------------------
        // 4. Call API
        // -----------------------------------------

        const response = await fetch(url, {

            method: "GET",

            headers: {

                "Authorization":
                    `Bearer ${token}`,

                "Content-Type":
                    "application/json"
            }
        });


        // -----------------------------------------
        // 5. Check response
        // -----------------------------------------

        if (!response.ok) {

            console.error(
                "API Error:",
                response.status,
                response.statusText
            );

            return;
        }


        // -----------------------------------------
        // 6. Convert response to JavaScript
        // -----------------------------------------

        const orders =
            await response.json();


        // -----------------------------------------
        // 7. Show data in Console
        // -----------------------------------------

        console.log(
            "Orders received from API:"
        );

        console.log(orders);


        // -----------------------------------------
        // 8. Get HTML container
        // -----------------------------------------

        const ordersContainer =
            document.getElementById(
                "orders-container"
            );


        if (!ordersContainer) {

            console.error(
                "orders-container was not found in HTML."
            );

            return;
        }


        // Clear old HTML

        ordersContainer.innerHTML = "";


        // -----------------------------------------
        // 9. Check if there are no orders
        // -----------------------------------------

        if (
            !orders ||
            orders.length === 0
        ) {

            ordersContainer.innerHTML = `

                <p class="no-orders">

                    You don't have any orders yet.

                </p>

            `;

            return;
        }


        // -----------------------------------------
        // 10. Loop through Orders
        // -----------------------------------------

        orders.forEach(order => {


            // Create <details>

            const orderElement =
                document.createElement(
                    "details"
                );


            orderElement.className =
                "order";


            // -----------------------------------------
            // 11. Create Order HTML
            // -----------------------------------------

            orderElement.innerHTML = `

                <summary class="order-header">


                    <span>

                        <strong>
                            Order #${order.orderId}
                        </strong>


                        <small>
                            ${formatDate(order.orderDate)}
                        </small>

                    </span>



                    <span>

                        <b>
                            ${order.orderStatus}
                        </b>


                        <strong>
                            ${Number(
                                order.totalAmount
                            ).toFixed(3)} OMR
                        </strong>

                    </span>


                </summary>



                <div class="order-details">


                    <h3>
                        Order Information
                    </h3>



                    <div class="status-container">


                        <article>

                            <p>📦</p>

                            <h4>
                                Order Status
                            </h4>

                            <p>
                                ${order.orderStatus}
                            </p>

                        </article>



                        <article>

                            <p>💳</p>

                            <h4>
                                Payment Status
                            </h4>

                            <p>
                                ${order.paymentStatus}
                            </p>

                        </article>



                        <article>

                            <p>🚚</p>

                            <h4>
                                Delivery Status
                            </h4>

                            <p>
                                ${order.deliveryStatus}
                            </p>

                        </article>



                        <article>

                            <p>💰</p>

                            <h4>
                                Total Amount
                            </h4>

                            <p>
                                ${Number(
                                    order.totalAmount
                                ).toFixed(3)} OMR
                            </p>

                        </article>


                    </div>



                    <h3>
                        Products
                    </h3>



                    <table class="table">


                        <thead>

                            <tr>

                                <th>
                                    Product Name
                                </th>

                                <th>
                                    Quantity
                                </th>

                                <th>
                                    Unit Price
                                </th>

                            </tr>

                        </thead>



                        <tbody>

                            ${
                                createProductsHTML(
                                    order.products
                                )
                            }

                        </tbody>


                    </table>


                </div>

            `;


            // -----------------------------------------
            // 12. Add Order to HTML
            // -----------------------------------------

            ordersContainer.appendChild(
                orderElement
            );

        });

    }


    catch (error) {

        console.error(
            "Error loading order history:",
            error
        );

    }

}



// =====================================================
// Create Products HTML
// =====================================================

function createProductsHTML(products) {


    if (
        !products ||
        products.length === 0
    ) {

        return `

            <tr>

                <td colspan="3">

                    No products found.

                </td>

            </tr>

        `;
    }



    return products
        .map(product => {

            return `

                <tr>

                    <td>
                        ${product.productName}
                    </td>


                    <td>
                        ${product.quantity}
                    </td>


                    <td>
                        ${Number(
                            product.unitPrice
                        ).toFixed(3)} OMR
                    </td>

                </tr>

            `;

        })
        .join("");

}



// =====================================================
// Format Date
// =====================================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-GB"
    );

}



// =====================================================
// Start
// =====================================================

loadOrderHistory();