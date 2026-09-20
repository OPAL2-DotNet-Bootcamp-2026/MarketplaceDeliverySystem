// =====================================================
// ORDER HISTORY - TypeScript
// =====================================================

// =====================================================
// INTERFACES
// =====================================================

interface OrderProduct {
    productName: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    orderId: number;
    orderDate: string;
    orderStatus: string;
    paymentStatus: string;
    deliveryStatus: string;
    totalAmount: number;
    products: OrderProduct[];
}


// =====================================================
// VARIABLES
// =====================================================

let allOrders: Order[] = [];

let filteredOrders: Order[] = [];

let currentPage: number = 1;

const ordersPerPage: number = 5;


// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrderHistory(): Promise<void> {

    // =========================================
    // Get JWT Token
    // =========================================

    const token: string | null =
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

    const url: string =
        "https://localhost:7299/api/Order/GetMyOrderHistory";


    // =========================================
    // Container
    // =========================================

    const ordersContainer: HTMLElement | null =
        document.getElementById("orders-container");

    if (!ordersContainer) {

        console.error(
            "orders-container was not found."
        );

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

        const response: Response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


        // =========================================
        // Error
        // =========================================

        if (!response.ok) {

            const errorText: string =
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

        const orders: unknown =
            await response.json();

        console.log(
            "Orders received:",
            orders
        );


        // =========================================
        // Save Orders
        // =========================================

        if (Array.isArray(orders)) {

            allOrders = orders.filter(
                isOrder
            );

        } else {

            allOrders = [];
        }


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

    catch (error: unknown) {

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
// CHECK ORDER TYPE
// =====================================================

function isOrder(
    value: unknown
): value is Order {

    if (
        typeof value !== "object" ||
        value === null
    ) {
        return false;
    }

    const order =
        value as Record<string, unknown>;

    return (
        typeof order.orderId === "number" &&
        typeof order.orderDate === "string" &&
        typeof order.orderStatus === "string" &&
        typeof order.paymentStatus === "string" &&
        typeof order.deliveryStatus === "string" &&
        typeof order.totalAmount === "number" &&
        Array.isArray(order.products)
    );
}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(
    orders: Order[]
): void {

    const total: number =
        orders.length;


    // =========================================
    // Pending
    // =========================================

    const pending: number =
        orders.filter(
            (order: Order): boolean =>
                getStatus(
                    order.orderStatus
                ) === "pending"
        ).length;


    // =========================================
    // Completed / Delivered
    // =========================================

    const completed: number =
        orders.filter(
            (order: Order): boolean => {

                const status: string =
                    getStatus(
                        order.orderStatus
                    );

                return (
                    status === "delivered" ||
                    status === "completed"
                );
            }
        ).length;


    // =========================================
    // Cancelled
    // =========================================

    const cancelled: number =
        orders.filter(
            (order: Order): boolean =>
                getStatus(
                    order.orderStatus
                ) === "cancelled"
        ).length;


    // =========================================
    // Hero Total
    // =========================================

    const totalElement: HTMLElement | null =
        document.getElementById(
            "total-orders"
        );

    if (totalElement) {

        totalElement.textContent =
            String(total);
    }


    // =========================================
    // Statistics Elements
    // =========================================

    const statTotal: HTMLElement | null =
        document.getElementById(
            "stat-total"
        );

    const statPending: HTMLElement | null =
        document.getElementById(
            "stat-pending"
        );

    const statCompleted: HTMLElement | null =
        document.getElementById(
            "stat-completed"
        );

    const statCancelled: HTMLElement | null =
        document.getElementById(
            "stat-cancelled"
        );


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

function renderOrders(): void {

    const container: HTMLElement | null =
        document.getElementById(
            "orders-container"
        );


    if (!container) {

        console.error(
            "orders-container was not found."
        );

        return;
    }


    // Clear old orders

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

    const startIndex: number =
        (currentPage - 1) *
        ordersPerPage;


    const endIndex: number =
        startIndex +
        ordersPerPage;


    const pageOrders: Order[] =
        filteredOrders.slice(
            startIndex,
            endIndex
        );


    // =========================================
    // Create Orders
    // =========================================

    pageOrders.forEach(
        (order: Order): void => {

            const orderElement:
                HTMLDetailsElement =
                createOrderElement(
                    order
                );

            container.appendChild(
                orderElement
            );
        }
    );


    // =========================================
    // Update Information
    // =========================================

    updateResultsText();

    renderPagination();
}


// =====================================================
// CREATE ORDER ELEMENT
// =====================================================

function createOrderElement(
    order: Order
): HTMLDetailsElement {

    const details:
        HTMLDetailsElement =
        document.createElement(
            "details"
        );


    details.className =
        "order";


    // =========================================
    // Products Count
    // =========================================

    const productCount: number =
        order.products
            ? order.products.length
            : 0;


    const productText: string =
        productCount === 1
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

function createProductsHTML(
    products: OrderProduct[] | undefined
): string {

    // =========================================
    // No Products
    // =========================================

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


    // =========================================
    // Products
    // =========================================

    return products
        .map(
            (
                product: OrderProduct
            ): string => `

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

const searchOrders:
    HTMLInputElement | null =
    document.getElementById(
        "search-orders"
    ) as HTMLInputElement | null;


if (searchOrders) {

    searchOrders.addEventListener(
        "input",
        (event: Event): void => {

            // Get target

            const input =
                event.target;


            // Check target type

            if (
                !(input instanceof HTMLInputElement)
            ) {
                return;
            }


            // Get search text

            const search: string =
                input.value
                    .toLowerCase()
                    .trim();


            // Filter orders

            filteredOrders =
                allOrders.filter(
                    (
                        order: Order
                    ): boolean => {

                        const orderId: string =
                            String(
                                order.orderId
                            ).toLowerCase();


                        const products:
                            OrderProduct[] =
                            order.products || [];


                        const productMatch:
                            boolean =
                            products.some(
                                (
                                    product: OrderProduct
                                ): boolean =>
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


            // Reset page

            currentPage = 1;


            // Render

            renderOrders();
        }
    );
}


// =====================================================
// STATUS FILTER
// =====================================================

const statusFilter:
    HTMLSelectElement | null =
    document.getElementById(
        "status-filter"
    ) as HTMLSelectElement | null;


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        (event: Event): void => {

            // Get target

            const select =
                event.target;


            // Check target type

            if (
                !(select instanceof HTMLSelectElement)
            ) {
                return;
            }


            // Selected value

            const selected: string =
                select.value.toLowerCase();


            // =========================================
            // All
            // =========================================

            if (
                selected === "all"
            ) {

                filteredOrders =
                    [...allOrders];
            }


            // =========================================
            // Specific Status
            // =========================================

            else {

                filteredOrders =
                    allOrders.filter(
                        (
                            order: Order
                        ): boolean =>
                            getStatus(
                                order.orderStatus
                            ) === selected
                    );
            }


            // Reset page

            currentPage = 1;


            // Render

            renderOrders();
        }
    );
}


// =====================================================
// SORT
// =====================================================

const sortOrders:
    HTMLSelectElement | null =
    document.getElementById(
        "sort-orders"
    ) as HTMLSelectElement | null;


if (sortOrders) {

    sortOrders.addEventListener(
        "change",
        (event: Event): void => {

            // Get target

            const select =
                event.target;


            // Check target type

            if (
                !(select instanceof HTMLSelectElement)
            ) {
                return;
            }


            // Selected sort

            const value: string =
                select.value;


            // =========================================
            // Sort
            // =========================================

            filteredOrders.sort(
                (
                    a: Order,
                    b: Order
                ): number => {

                    // Newest

                    if (
                        value === "newest"
                    ) {

                        return (
                            new Date(
                                b.orderDate
                            ).getTime()
                            -
                            new Date(
                                a.orderDate
                            ).getTime()
                        );
                    }


                    // Oldest

                    if (
                        value === "oldest"
                    ) {

                        return (
                            new Date(
                                a.orderDate
                            ).getTime()
                            -
                            new Date(
                                b.orderDate
                            ).getTime()
                        );
                    }


                    // Highest Price

                    if (
                        value === "highest"
                    ) {

                        return (
                            Number(
                                b.totalAmount
                            )
                            -
                            Number(
                                a.totalAmount
                            )
                        );
                    }


                    // Lowest Price

                    if (
                        value === "lowest"
                    ) {

                        return (
                            Number(
                                a.totalAmount
                            )
                            -
                            Number(
                                b.totalAmount
                            )
                        );
                    }


                    return 0;
                }
            );


            // Reset page

            currentPage = 1;


            // Render

            renderOrders();
        }
    );
}


// =====================================================
// PAGINATION
// =====================================================

function renderPagination(): void {

    const pagination:
        HTMLElement | null =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {

        console.error(
            "pagination was not found."
        );

        return;
    }


    // Clear pagination

    pagination.innerHTML = "";


    // Calculate pages

    const totalPages: number =
        Math.ceil(
            filteredOrders.length /
            ordersPerPage
        );


    // No pagination needed

    if (
        totalPages <= 1
    ) {

        return;
    }


    // =========================================
    // Previous
    // =========================================

    if (
        currentPage > 1
    ) {

        const previous:
            HTMLButtonElement =
            createPageButton(
                "‹",
                currentPage - 1,
                true
            );


        pagination.appendChild(
            previous
        );
    }


    // =========================================
    // Pages
    // =========================================

    for (
        let i: number = 1;
        i <= totalPages;
        i++
    ) {

        const button:
            HTMLButtonElement =
            createPageButton(
                String(i),
                i,
                false
            );


        pagination.appendChild(
            button
        );
    }


    // =========================================
    // Next
    // =========================================

    if (
        currentPage < totalPages
    ) {

        const next:
            HTMLButtonElement =
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
    text: string,
    page: number,
    arrow: boolean
): HTMLButtonElement {

    const button:
        HTMLButtonElement =
        document.createElement(
            "button"
        );


    button.className =
        "page-button";


    // Arrow

    if (arrow) {

        button.classList.add(
            "arrow"
        );
    }


    // Active page

    if (
        page === currentPage
    ) {

        button.classList.add(
            "active"
        );
    }


    // Text

    button.textContent =
        text;


    // Click

    button.addEventListener(
        "click",
        (): void => {

            currentPage =
                page;

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

function updateResultsText(): void {

    const text:
        HTMLElement | null =
        document.getElementById(
            "results-text"
        );


    if (!text) {

        return;
    }


    // No results

    if (
        filteredOrders.length === 0
    ) {

        text.textContent =
            "No orders found";

        return;
    }


    // Start

    const start: number =
        (currentPage - 1) *
        ordersPerPage +
        1;


    // End

    const end: number =
        Math.min(
            currentPage *
            ordersPerPage,
            filteredOrders.length
        );


    text.textContent =
        `Showing ${start}-${end} of ${filteredOrders.length} orders`;
}


// =====================================================
// STATUS NORMALIZATION
// =====================================================

function getStatus(
    status: string | null | undefined
): string {

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

function formatAmount(
    amount: number | string
): string {

    const numberValue: number =
        Number(amount);


    if (
        Number.isNaN(numberValue)
    ) {

        return "0.000";
    }


    return numberValue.toFixed(3);
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
    dateString: string
): string {

    const date: Date =
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

function safeValue(
    value: unknown
): string {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Not Available";
    }


    return String(value);
}


// =====================================================
// ERROR
// =====================================================

function showError(
    message: string
): void {

    const container:
        HTMLElement | null =
        document.getElementById(
            "orders-container"
        );


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

    const totalOrders:
        HTMLElement | null =
        document.getElementById(
            "total-orders"
        );

    const statTotal:
        HTMLElement | null =
        document.getElementById(
            "stat-total"
        );

    const statPending:
        HTMLElement | null =
        document.getElementById(
            "stat-pending"
        );

    const statCompleted:
        HTMLElement | null =
        document.getElementById(
            "stat-completed"
        );

    const statCancelled:
        HTMLElement | null =
        document.getElementById(
            "stat-cancelled"
        );


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