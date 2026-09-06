async function loadOrderHistory() {

    // =========================================
    // 1. Get JWT Token
    // =========================================

    const token = localStorage.getItem("authToken");

    console.log("Token:", token);


    if (!token) {
        console.error("JWT token was not found in localStorage.");
        return;
    }


    // =========================================
    // 2. Read JWT Payload
    // =========================================

   /* const payload = JSON.parse(
        atob(token.split(".")[1])
    );

    console.log("JWT Payload:", payload);*/


    // =========================================
    // 3. Get Customer ID from JWT
    // =========================================

   /* const customerId =
        payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

    console.log(
        "Logged-in Customer ID:",
        customerId
    );


    if (!customerId) {
        console.error(
            "Customer ID was not found in JWT."
        );
        return;
    }

*/
    // =========================================
    // 4. API URL
    // =========================================

    const url =
        "https://localhost:7299/api/Customer/ViewOrderHistory/";

    console.log("TEST API URL:", url);


    // =========================================
    // 5. Call API
    // =========================================

    try {

        const response = await fetch(url, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }

        });


        // =========================================
        // 6. Check Response
        // =========================================

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "API Error:",
                response.status,
                response.statusText
            );

            console.error(
                "API Response:",
                errorText
            );

            return;
        }


        // =========================================
        // 7. Convert Response to JavaScript
        // =========================================

        const orders = await response.json();

        console.log(
            "Orders received from API:"
        );

        console.log(orders);


        // =========================================
        // 8. Get HTML Container
        // =========================================

        const ordersContainer =
            document.getElementById("orders-container");


        if (!ordersContainer) {

            console.error(
                "orders-container was not found in HTML."
            );

            return;
        }


        ordersContainer.innerHTML = "";


        // =========================================
        // 9. Check if No Orders
        // =========================================

        if (!orders || orders.length === 0) {

            ordersContainer.innerHTML = `
                <p class="no-orders">
                    You don't have any orders yet.
                </p>
            `;

            return;
        }


        // =========================================
        // 10. Display Orders
        // =========================================

        orders.forEach(order => {

            const orderElement =
                document.createElement("details");

            orderElement.className = "order";


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

                            ${createProductsHTML(
                                order.products
                            )}

                        </tbody>

                    </table>

                </div>
            `;


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


// =========================================
// Create Products HTML
// =========================================

function createProductsHTML(products) {

    if (!products || products.length === 0) {

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


// =========================================
// Format Date
// =========================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB");
}


// =========================================
// Start
// =========================================

loadOrderHistory();