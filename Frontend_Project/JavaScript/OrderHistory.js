// =====================================================
// ORDER HISTORY
// =====================================================


let allOrders = [];

let filteredOrders = [];

let currentPage = 1;

const ordersPerPage = 5;



// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrderHistory() {


    // =========================================
    // Get JWT Token
    // =========================================

    const token =
        localStorage.getItem("authToken");


    console.log("Token:", token);


    if (!token) {

        console.error(
            "JWT token was not found in localStorage."
        );

        showError(
            "Please login first to view your orders."
        );

        return;
    }



    // =========================================
    // API URL
    // =========================================

    const url =
        "https://localhost:7299/api/Customer/ViewOrderHistory/";


    // =========================================
    // Container
    // =========================================

    const ordersContainer =
        document.getElementById(
            "orders-container"
        );


    if (!ordersContainer) {

        console.error(
            "orders-container was not found."
        );

        return;
    }



    ordersContainer.innerHTML = `

        <div class="loading-orders">

            Loading your orders...

        </div>

    `;



    // =========================================
    // Fetch API
    // =========================================

    try {


        const response =
            await fetch(
                url,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );



        // =========================================
        // Error
        // =========================================

        if (!response.ok) {


            const errorText =
                await response.text();


            console.error(
                "API Error:",
                response.status,
                response.statusText
            );


            console.error(
                "API Response:",
                errorText
            );


            showError(
                "Unable to load your orders."
            );


            return;
        }



        // =========================================
        // JSON
        // =========================================

        const orders =
            await response.json();


        console.log(
            "Orders received:",
            orders
        );



        // =========================================
        // Save Orders
        // =========================================

        allOrders =
            Array.isArray(orders)
                ? orders
                : [];



        // =========================================
        // Statistics
        // =========================================

        updateStatistics(
            allOrders
        );



        // =========================================
        // Initial Display
        // =========================================

        filteredOrders =
            [...allOrders];


        currentPage = 1;


        renderOrders();


    }

    catch (error) {


        console.error(
            "Error loading order history:",
            error
        );


        showError(
            "Something went wrong while loading your orders."
        );

    }

}



// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(orders) {


    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                getStatus(
                    order.orderStatus
                ) === "pending"
        ).length;


    const completed =
        orders.filter(
            order => {

                const status =
                    getStatus(
                        order.orderStatus
                    );

                return (
                    status === "delivered" ||
                    status === "completed"
                );

            }
        ).length;


    const cancelled =
        orders.filter(
            order =>
                getStatus(
                    order.orderStatus
                ) === "cancelled"
        ).length;



    // Hero

    document.getElementById(
        "total-orders"
    ).textContent = total;



    // Statistics

    document.getElementById(
        "stat-total"
    ).textContent = total;


    document.getElementById(
        "stat-pending"
    ).textContent = pending;


    document.getElementById(
        "stat-completed"
    ).textContent = completed;


    document.getElementById(
        "stat-cancelled"
    ).textContent = cancelled;

}



// =====================================================
// RENDER ORDERS
// =====================================================

function renderOrders() {


    const container =
        document.getElementById(
            "orders-container"
        );


    container.innerHTML = "";



    // =========================================
    // No Results
    // =========================================

    if (
        filteredOrders.length === 0
    ) {


        container.innerHTML = `

            <div class="no-orders">

                No orders found.

            </div>

        `;


        updateResultsText();

        renderPagination();

        return;
    }



    // =========================================
    // Pagination
    // =========================================

    const startIndex =
        (currentPage - 1)
        * ordersPerPage;


    const endIndex =
        startIndex
        + ordersPerPage;


    const pageOrders =
        filteredOrders.slice(
            startIndex,
            endIndex
        );



    // =========================================
    // Create Orders
    // =========================================

    pageOrders.forEach(
        (order, index) => {

            const orderElement =
                createOrderElement(
                    order
                );


            container.appendChild(
                orderElement
            );

        }
    );



    updateResultsText();

    renderPagination();

}



// =====================================================
// CREATE ORDER ELEMENT
// =====================================================

function createOrderElement(order) {


    const details =
        document.createElement(
            "details"
        );


    details.className =
        "order";



    // =========================================
    // Products Count
    // =========================================

    const productCount =
        order.products
            ? order.products.length
            : 0;


    const productText =
        productCount === 1
            ? "1 Product"
            : `${productCount} Products`;



    // =========================================
    // HTML
    // =========================================

    details.innerHTML = `

        <!-- =================================
             ORDER HEADER
             ================================= -->

        <summary class="order-header">


            <!-- Arrow -->

            <span class="order-arrow">

                ▶

            </span>



            <!-- Order -->

            <span class="order-main-info">

                <span class="order-number">

                    Order #${order.orderId}

                </span>

                <span class="order-date">

                    ${formatDate(
                        order.orderDate
                    )}

                </span>

            </span>



            <!-- Products -->

            <span class="items-count">

                ${productText}

            </span>



            <!-- Status -->

            <span class="status-badge">

                ${safeValue(
                    order.orderStatus
                )}

            </span>



            <!-- Total -->

            <span class="order-total">

                ${formatAmount(
                    order.totalAmount
                )}
                OMR

            </span>



            <!-- View -->

            <span class="view-details">

                View Details

            </span>


        </summary>



        <!-- =================================
             DETAILS
             ================================= -->

        <div class="order-details">


            <h2 class="details-title">

                Order Information

            </h2>



            <!-- Status Cards -->

            <div class="status-container">


                <article class="status-card">

                    <div class="status-icon">
                        📦
                    </div>

                    <h4>
                        Order Status
                    </h4>

                    <p>
                        ${safeValue(
                            order.orderStatus
                        )}
                    </p>

                </article>



                <article class="status-card">

                    <div class="status-icon">
                        💳
                    </div>

                    <h4>
                        Payment Status
                    </h4>

                    <p>
                        ${safeValue(
                            order.paymentStatus
                        )}
                    </p>

                </article>



                <article class="status-card">

                    <div class="status-icon">
                        🚚
                    </div>

                    <h4>
                        Delivery Status
                    </h4>

                    <p>
                        ${safeValue(
                            order.deliveryStatus
                        )}
                    </p>

                </article>



                <article class="status-card">

                    <div class="status-icon">
                        💰
                    </div>

                    <h4>
                        Total Amount
                    </h4>

                    <p>

                        ${formatAmount(
                            order.totalAmount
                        )}
                        OMR

                    </p>

                </article>


            </div>



            <!-- Products -->

            <h2 class="details-title products-title">

                Products

            </h2>



            <div class="products-wrapper">


                <table class="order-products">


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


        </div>

    `;



    return details;

}



// =====================================================
// PRODUCTS
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
        .map(
            product => `

                <tr>

                    <td class="product-name">

                        ${safeValue(
                            product.productName
                        )}

                    </td>


                    <td>

                        <span class="product-quantity">

                            ${product.quantity}

                        </span>

                    </td>


                    <td class="product-price">

                        ${formatAmount(
                            product.unitPrice
                        )}

                        OMR

                    </td>

                </tr>

            `
        )
        .join("");

}



// =====================================================
// SEARCH
// =====================================================

document
    .getElementById("search-orders")
    .addEventListener(
        "input",
        function () {


            const search =
                this.value
                    .toLowerCase()
                    .trim();


            filteredOrders =
                allOrders.filter(
                    order => {


                        const orderId =
                            String(
                                order.orderId
                            ).toLowerCase();


                        const products =
                            order.products || [];


                        const productMatch =
                            products.some(
                                product =>
                                    String(
                                        product.productName
                                    )
                                    .toLowerCase()
                                    .includes(search)
                            );


                        return (
                            orderId.includes(search) ||
                            productMatch
                        );

                    }
                );


            currentPage = 1;

            renderOrders();

        }
    );



// =====================================================
// STATUS FILTER
// =====================================================

document
    .getElementById("status-filter")
    .addEventListener(
        "change",
        function () {


            const selected =
                this.value
                    .toLowerCase();


            if (
                selected === "all"
            ) {

                filteredOrders =
                    [...allOrders];

            }

            else {

                filteredOrders =
                    allOrders.filter(
                        order =>
                            getStatus(
                                order.orderStatus
                            ) === selected
                    );

            }


            currentPage = 1;

            renderOrders();

        }
    );



// =====================================================
// SORT
// =====================================================

document
    .getElementById("sort-orders")
    .addEventListener(
        "change",
        function () {


            const value =
                this.value;


            filteredOrders.sort(
                (a, b) => {


                    if (
                        value === "newest"
                    ) {

                        return new Date(
                            b.orderDate
                        )
                        -
                        new Date(
                            a.orderDate
                        );

                    }


                    if (
                        value === "oldest"
                    ) {

                        return new Date(
                            a.orderDate
                        )
                        -
                        new Date(
                            b.orderDate
                        );

                    }


                    if (
                        value === "highest"
                    ) {

                        return Number(
                            b.totalAmount
                        )
                        -
                        Number(
                            a.totalAmount
                        );

                    }


                    if (
                        value === "lowest"
                    ) {

                        return Number(
                            a.totalAmount
                        )
                        -
                        Number(
                            b.totalAmount
                        );

                    }


                    return 0;

                }
            );


            currentPage = 1;

            renderOrders();

        }
    );



// =====================================================
// PAGINATION
// =====================================================

function renderPagination() {


    const pagination =
        document.getElementById(
            "pagination"
        );


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredOrders.length
            /
            ordersPerPage
        );


    if (
        totalPages <= 1
    ) {

        return;

    }



    // Previous

    if (
        currentPage > 1
    ) {

        const previous =
            createPageButton(
                "‹",
                currentPage - 1,
                true
            );


        pagination.appendChild(
            previous
        );

    }



    // Pages

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {


        const button =
            createPageButton(
                i,
                i,
                false
            );


        pagination.appendChild(
            button
        );

    }



    // Next

    if (
        currentPage < totalPages
    ) {

        const next =
            createPageButton(
                "›",
                currentPage + 1,
                true
            );


        pagination.appendChild(
            next
        );

    }

}



// =====================================================
// CREATE PAGE BUTTON
// =====================================================

function createPageButton(
    text,
    page,
    arrow
) {


    const button =
        document.createElement(
            "button"
        );


    button.className =
        "page-button";


    if (arrow) {

        button.classList.add(
            "arrow"
        );

    }


    if (
        page === currentPage
    ) {

        button.classList.add(
            "active"
        );

    }


    button.textContent =
        text;


    button.addEventListener(
        "click",
        function () {

            currentPage = page;

            renderOrders();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    return button;

}



// =====================================================
// RESULTS TEXT
// =====================================================

function updateResultsText() {


    const text =
        document.getElementById(
            "results-text"
        );


    if (
        filteredOrders.length === 0
    ) {

        text.textContent =
            "No orders found";

        return;

    }


    const start =
        (currentPage - 1)
        * ordersPerPage
        + 1;


    const end =
        Math.min(
            currentPage * ordersPerPage,
            filteredOrders.length
        );


    text.textContent =
        `Showing ${start}-${end} of ${filteredOrders.length} orders`;

}



// =====================================================
// STATUS NORMALIZATION
// =====================================================

function getStatus(status) {


    if (
        !status
    ) {

        return "";

    }


    return String(status)
        .toLowerCase()
        .trim();

}



// =====================================================
// FORMAT AMOUNT
// =====================================================

function formatAmount(amount) {


    const number =
        Number(amount);


    if (
        Number.isNaN(number)
    ) {

        return "0.000";

    }


    return number.toFixed(3);

}



// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-GB",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric"

        }
    );

}



// =====================================================
// SAFE VALUE
// =====================================================

function safeValue(value) {


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Not Available";

    }


    return value;

}



// =====================================================
// ERROR
// =====================================================

function showError(message) {


    const container =
        document.getElementById(
            "orders-container"
        );


    container.innerHTML = `

        <div class="orders-error">

            ${message}

        </div>

    `;


    document.getElementById(
        "total-orders"
    ).textContent = "0";


    document.getElementById(
        "stat-total"
    ).textContent = "0";


    document.getElementById(
        "stat-pending"
    ).textContent = "0";


    document.getElementById(
        "stat-completed"
    ).textContent = "0";


    document.getElementById(
        "stat-cancelled"
    ).textContent = "0";

}



// =====================================================
// START
// =====================================================

loadOrderHistory();