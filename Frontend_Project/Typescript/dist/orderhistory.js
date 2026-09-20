// =====================================================
// ORDER HISTORY - TypeScript
// =====================================================
// =====================================================
// VARIABLES
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
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);
    if (!token) {
        console.error("JWT token was not found in localStorage.");
        showError("Please login first to view your orders.");
        return;
    }
    // =========================================
    // API URL
    // =========================================
    const url = "https://localhost:7299/api/Order/GetMyOrderHistory";
    // =========================================
    // Container
    // =========================================
    const ordersContainer = document.getElementById("orders-container");
    if (!ordersContainer) {
        console.error("orders-container was not found.");
        return;
    }
    // =========================================
    // Loading
    // =========================================
    ordersContainer.innerHTML = `
        <div class="loading-orders">
            Loading your orders...
        </div>
    `;
    // =========================================
    // Fetch API
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
        // Error
        // =========================================
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, response.statusText);
            console.error("API Response:", errorText);
            showError("Unable to load your orders.");
            return;
        }
        // =========================================
        // JSON
        // =========================================
        const orders = await response.json();
        console.log("Orders received:", orders);
        // =========================================
        // Save Orders
        // =========================================
        if (Array.isArray(orders)) {
            allOrders = orders.filter(isOrder);
        }
        else {
            allOrders = [];
        }
        // =========================================
        // Statistics
        // =========================================
        updateStatistics(allOrders);
        // =========================================
        // Initial Display
        // =========================================
        filteredOrders =
            [...allOrders];
        currentPage = 1;
        renderOrders();
    }
    catch (error) {
        console.error("Error loading order history:", error);
        showError("Something went wrong while loading your orders.");
    }
}
// =====================================================
// CHECK ORDER TYPE
// =====================================================
function isOrder(value) {
    if (typeof value !== "object" ||
        value === null) {
        return false;
    }
    const order = value;
    return (typeof order.orderId === "number" &&
        typeof order.orderDate === "string" &&
        typeof order.orderStatus === "string" &&
        typeof order.paymentStatus === "string" &&
        typeof order.deliveryStatus === "string" &&
        typeof order.totalAmount === "number" &&
        Array.isArray(order.products));
}
// =====================================================
// UPDATE STATISTICS
// =====================================================
function updateStatistics(orders) {
    const total = orders.length;
    // =========================================
    // Pending
    // =========================================
    const pending = orders.filter((order) => getStatus(order.orderStatus) === "pending").length;
    // =========================================
    // Completed / Delivered
    // =========================================
    const completed = orders.filter((order) => {
        const status = getStatus(order.orderStatus);
        return (status === "delivered" ||
            status === "completed");
    }).length;
    // =========================================
    // Cancelled
    // =========================================
    const cancelled = orders.filter((order) => getStatus(order.orderStatus) === "cancelled").length;
    // =========================================
    // Hero Total
    // =========================================
    const totalElement = document.getElementById("total-orders");
    if (totalElement) {
        totalElement.textContent =
            String(total);
    }
    // =========================================
    // Statistics Elements
    // =========================================
    const statTotal = document.getElementById("stat-total");
    const statPending = document.getElementById("stat-pending");
    const statCompleted = document.getElementById("stat-completed");
    const statCancelled = document.getElementById("stat-cancelled");
    // =========================================
    // Update Statistics
    // =========================================
    if (statTotal) {
        statTotal.textContent =
            String(total);
    }
    if (statPending) {
        statPending.textContent =
            String(pending);
    }
    if (statCompleted) {
        statCompleted.textContent =
            String(completed);
    }
    if (statCancelled) {
        statCancelled.textContent =
            String(cancelled);
    }
}
// =====================================================
// RENDER ORDERS
// =====================================================
function renderOrders() {
    const container = document.getElementById("orders-container");
    if (!container) {
        console.error("orders-container was not found.");
        return;
    }
    // Clear old orders
    container.innerHTML = "";
    // =========================================
    // No Results
    // =========================================
    if (filteredOrders.length === 0) {
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
    const startIndex = (currentPage - 1) *
        ordersPerPage;
    const endIndex = startIndex +
        ordersPerPage;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);
    // =========================================
    // Create Orders
    // =========================================
    pageOrders.forEach((order) => {
        const orderElement = createOrderElement(order);
        container.appendChild(orderElement);
    });
    // =========================================
    // Update Information
    // =========================================
    updateResultsText();
    renderPagination();
}
// =====================================================
// CREATE ORDER ELEMENT
// =====================================================
function createOrderElement(order) {
    const details = document.createElement("details");
    details.className =
        "order";
    // =========================================
    // Products Count
    // =========================================
    const productCount = order.products
        ? order.products.length
        : 0;
    const productText = productCount === 1
        ? "1 Product"
        : `${productCount} Products`;
    // =========================================
    // Order HTML
    // =========================================
    details.innerHTML = `

        <summary class="order-header">

            <span class="order-arrow">
                ▶
            </span>

            <span class="order-main-info">

                <span class="order-number">
                    Order #${order.orderId}
                </span>

                <span class="order-date">
                    ${formatDate(order.orderDate)}
                </span>

            </span>

            <span class="items-count">
                ${productText}
            </span>

            <span class="status-badge">
                ${safeValue(order.orderStatus)}
            </span>

            <span class="order-total">
                ${formatAmount(order.totalAmount)}
                OMR
            </span>

            <span class="view-details">
                View Details
            </span>

        </summary>


        <div class="order-details">

            <h2 class="details-title">
                Order Information
            </h2>


            <div class="status-container">

                <!-- Order Status -->

                <article class="status-card">

                    <div class="status-icon">
                        📦
                    </div>

                    <h4>
                        Order Status
                    </h4>

                    <p>
                        ${safeValue(order.orderStatus)}
                    </p>

                </article>


                <!-- Payment Status -->

                <article class="status-card">

                    <div class="status-icon">
                        💳
                    </div>

                    <h4>
                        Payment Status
                    </h4>

                    <p>
                        ${safeValue(order.paymentStatus)}
                    </p>

                </article>


                <!-- Delivery Status -->

                <article class="status-card">

                    <div class="status-icon">
                        🚚
                    </div>

                    <h4>
                        Delivery Status
                    </h4>

                    <p>
                        ${safeValue(order.deliveryStatus)}
                    </p>

                </article>


                <!-- Total Amount -->

                <article class="status-card">

                    <div class="status-icon">
                        💰
                    </div>

                    <h4>
                        Total Amount
                    </h4>

                    <p>
                        ${formatAmount(order.totalAmount)}
                        OMR
                    </p>

                </article>

            </div>


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

                        ${createProductsHTML(order.products)}

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
    // =========================================
    // No Products
    // =========================================
    if (!products ||
        products.length === 0) {
        return `
            <tr>
                <td colspan="3">
                    No products found.
                </td>
            </tr>
        `;
    }
    // =========================================
    // Products
    // =========================================
    return products
        .map((product) => `

                <tr>

                    <td class="product-name">

                        ${safeValue(product.productName)}

                    </td>


                    <td>

                        <span class="product-quantity">

                            ${product.quantity}

                        </span>

                    </td>


                    <td class="product-price">

                        ${formatAmount(product.unitPrice)}

                        OMR

                    </td>

                </tr>
            `)
        .join("");
}
// =====================================================
// SEARCH
// =====================================================
const searchOrders = document.getElementById("search-orders");
if (searchOrders) {
    searchOrders.addEventListener("input", (event) => {
        // Get target
        const input = event.target;
        // Check target type
        if (!(input instanceof HTMLInputElement)) {
            return;
        }
        // Get search text
        const search = input.value
            .toLowerCase()
            .trim();
        // Filter orders
        filteredOrders =
            allOrders.filter((order) => {
                const orderId = String(order.orderId).toLowerCase();
                const products = order.products || [];
                const productMatch = products.some((product) => String(product.productName)
                    .toLowerCase()
                    .includes(search));
                return (orderId.includes(search) ||
                    productMatch);
            });
        // Reset page
        currentPage = 1;
        // Render
        renderOrders();
    });
}
// =====================================================
// STATUS FILTER
// =====================================================
const statusFilter = document.getElementById("status-filter");
if (statusFilter) {
    statusFilter.addEventListener("change", (event) => {
        // Get target
        const select = event.target;
        // Check target type
        if (!(select instanceof HTMLSelectElement)) {
            return;
        }
        // Selected value
        const selected = select.value.toLowerCase();
        // =========================================
        // All
        // =========================================
        if (selected === "all") {
            filteredOrders =
                [...allOrders];
        }
        // =========================================
        // Specific Status
        // =========================================
        else {
            filteredOrders =
                allOrders.filter((order) => getStatus(order.orderStatus) === selected);
        }
        // Reset page
        currentPage = 1;
        // Render
        renderOrders();
    });
}
// =====================================================
// SORT
// =====================================================
const sortOrders = document.getElementById("sort-orders");
if (sortOrders) {
    sortOrders.addEventListener("change", (event) => {
        // Get target
        const select = event.target;
        // Check target type
        if (!(select instanceof HTMLSelectElement)) {
            return;
        }
        // Selected sort
        const value = select.value;
        // =========================================
        // Sort
        // =========================================
        filteredOrders.sort((a, b) => {
            // Newest
            if (value === "newest") {
                return (new Date(b.orderDate).getTime()
                    -
                        new Date(a.orderDate).getTime());
            }
            // Oldest
            if (value === "oldest") {
                return (new Date(a.orderDate).getTime()
                    -
                        new Date(b.orderDate).getTime());
            }
            // Highest Price
            if (value === "highest") {
                return (Number(b.totalAmount)
                    -
                        Number(a.totalAmount));
            }
            // Lowest Price
            if (value === "lowest") {
                return (Number(a.totalAmount)
                    -
                        Number(b.totalAmount));
            }
            return 0;
        });
        // Reset page
        currentPage = 1;
        // Render
        renderOrders();
    });
}
// =====================================================
// PAGINATION
// =====================================================
function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) {
        console.error("pagination was not found.");
        return;
    }
    // Clear pagination
    pagination.innerHTML = "";
    // Calculate pages
    const totalPages = Math.ceil(filteredOrders.length /
        ordersPerPage);
    // No pagination needed
    if (totalPages <= 1) {
        return;
    }
    // =========================================
    // Previous
    // =========================================
    if (currentPage > 1) {
        const previous = createPageButton("‹", currentPage - 1, true);
        pagination.appendChild(previous);
    }
    // =========================================
    // Pages
    // =========================================
    for (let i = 1; i <= totalPages; i++) {
        const button = createPageButton(String(i), i, false);
        pagination.appendChild(button);
    }
    // =========================================
    // Next
    // =========================================
    if (currentPage < totalPages) {
        const next = createPageButton("›", currentPage + 1, true);
        pagination.appendChild(next);
    }
}
// =====================================================
// CREATE PAGE BUTTON
// =====================================================
function createPageButton(text, page, arrow) {
    const button = document.createElement("button");
    button.className =
        "page-button";
    // Arrow
    if (arrow) {
        button.classList.add("arrow");
    }
    // Active page
    if (page === currentPage) {
        button.classList.add("active");
    }
    // Text
    button.textContent =
        text;
    // Click
    button.addEventListener("click", () => {
        currentPage =
            page;
        renderOrders();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    return button;
}
// =====================================================
// RESULTS TEXT
// =====================================================
function updateResultsText() {
    const text = document.getElementById("results-text");
    if (!text) {
        return;
    }
    // No results
    if (filteredOrders.length === 0) {
        text.textContent =
            "No orders found";
        return;
    }
    // Start
    const start = (currentPage - 1) *
        ordersPerPage +
        1;
    // End
    const end = Math.min(currentPage *
        ordersPerPage, filteredOrders.length);
    text.textContent =
        `Showing ${start}-${end} of ${filteredOrders.length} orders`;
}
// =====================================================
// STATUS NORMALIZATION
// =====================================================
function getStatus(status) {
    if (!status) {
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
    const numberValue = Number(amount);
    if (Number.isNaN(numberValue)) {
        return "0.000";
    }
    return numberValue.toFixed(3);
}
// =====================================================
// FORMAT DATE
// =====================================================
function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return dateString;
    }
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
// =====================================================
// SAFE VALUE
// =====================================================
function safeValue(value) {
    if (value === null ||
        value === undefined ||
        value === "") {
        return "Not Available";
    }
    return String(value);
}
// =====================================================
// ERROR
// =====================================================
function showError(message) {
    const container = document.getElementById("orders-container");
    if (container) {
        container.innerHTML = `
            <div class="orders-error">
                ${message}
            </div>
        `;
    }
    // =========================================
    // Reset Statistics
    // =========================================
    const totalOrders = document.getElementById("total-orders");
    const statTotal = document.getElementById("stat-total");
    const statPending = document.getElementById("stat-pending");
    const statCompleted = document.getElementById("stat-completed");
    const statCancelled = document.getElementById("stat-cancelled");
    if (totalOrders) {
        totalOrders.textContent =
            "0";
    }
    if (statTotal) {
        statTotal.textContent =
            "0";
    }
    if (statPending) {
        statPending.textContent =
            "0";
    }
    if (statCompleted) {
        statCompleted.textContent =
            "0";
    }
    if (statCancelled) {
        statCancelled.textContent =
            "0";
    }
}
// =====================================================
// START
// =====================================================
loadOrderHistory();
export {};
