/// =====================================================
// 1. INTERFACES
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
// 2. VARIABLES
// =====================================================


let allOrders: Order[] = [];


let filteredOrders: Order[] = [];



let currentPage: number = 1;



const ordersPerPage: number = 5;


// =====================================================
// 3. LOAD ORDER HISTORY
// =====================================================

async function loadOrderHistory(): Promise<void> {

    // -------------------------------------------------
    // Get JWT Token
    // -------------------------------------------------

    const token: string | null =
        localStorage.getItem("authToken");


    // -------------------------------------------------
    // Check Token
    // -------------------------------------------------

    if (!token) {

        showError(
            "Please login first to view your orders."
        );

        return;
    }


    // -------------------------------------------------
    // API URL
    // -------------------------------------------------

    const url: string =
        "https://localhost:7299/api/Order/GetMyOrderHistory";


    // -------------------------------------------------
    // Get HTML Container
    // -------------------------------------------------

    const ordersContainer:
        HTMLElement | null =
        document.getElementById(
            "orders-container"
        );


    if (!ordersContainer) {

        console.error(
            "orders-container was not found."
        );

        return;
    }


    // -------------------------------------------------
    // Loading Message
    // -------------------------------------------------

    ordersContainer.innerHTML = `
        <div class="loading-orders">
            Loading your orders...
        </div>
    `;


    // -------------------------------------------------
    // Send Request
    // -------------------------------------------------

    try {

        const response: Response =
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


        // -------------------------------------------------
        // Check Response
        // -------------------------------------------------

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


        // -------------------------------------------------
        // Convert Response to JSON
        // -------------------------------------------------

        const orders: unknown =
            await response.json();


        console.log(
            "Orders received:",
            orders
        );


        // -------------------------------------------------
        // Save Orders
        // -------------------------------------------------

        if (Array.isArray(orders)) {

            allOrders =
                orders.filter(
                    isOrder
                );

        } else {

            allOrders = [];
        }


        // -------------------------------------------------
        // Initial Filter
        // -------------------------------------------------

        filteredOrders =
            [...allOrders];


        // -------------------------------------------------
        // Start From Page 1
        // -------------------------------------------------

        currentPage = 1;


        // -------------------------------------------------
        // Display Orders
        // -------------------------------------------------

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
// 4. CHECK ORDER DATA
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
// 5. RENDER ORDERS
// =====================================================

function renderOrders(): void {

    // -------------------------------------------------
    // Get Container
    // -------------------------------------------------

    const container:
        HTMLElement | null =
        document.getElementById(
            "orders-container"
        );


    if (!container) {

        console.error(
            "orders-container was not found."
        );

        return;
    }


    // -------------------------------------------------
    // Clear Old Orders
    // -------------------------------------------------

    container.innerHTML = "";


    // -------------------------------------------------
    // No Orders
    // -------------------------------------------------

    if (
        filteredOrders.length === 0
    ) {

        container.innerHTML = `
            <div class="no-orders">
                No orders found.
            </div>
        `;

        updateResultsText();

        return;
    }


    // -------------------------------------------------
    // Calculate Start
    // -------------------------------------------------

    const startIndex: number =
        (currentPage - 1) *
        ordersPerPage;


    // -------------------------------------------------
    // Calculate End
    // -------------------------------------------------

    const endIndex: number =
        startIndex +
        ordersPerPage;


    // -------------------------------------------------
    // Get Orders For Current Page
    // -------------------------------------------------

    const pageOrders: Order[] =
        filteredOrders.slice(
            startIndex,
            endIndex
        );


    // -------------------------------------------------
    // Create Each Order
    // -------------------------------------------------

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


    // -------------------------------------------------
    // Update Results Text
    // -------------------------------------------------

    updateResultsText();
}


// =====================================================
// 6. CREATE ORDER HTML
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


    // -------------------------------------------------
    // Number Of Products
    // -------------------------------------------------

    const productCount: number =
        order.products
            ? order.products.length
            : 0;


    const productText: string =
        productCount === 1
            ? "1 Product"
            : `${productCount} Products`;


    // -------------------------------------------------
    // Create HTML
    // -------------------------------------------------

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

                ${formatAmount(
                    order.totalAmount
                )}

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
                        ${safeValue(
                            order.orderStatus
                        )}
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
                        ${safeValue(
                            order.paymentStatus
                        )}
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
                        ${safeValue(
                            order.deliveryStatus
                        )}
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

                        ${formatAmount(
                            order.totalAmount
                        )}

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
// 7. CREATE PRODUCTS HTML
// =====================================================

function createProductsHTML(
    products: OrderProduct[] | undefined
): string {

    // -------------------------------------------------
    // No Products
    // -------------------------------------------------

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


    // -------------------------------------------------
    // Products
    // -------------------------------------------------

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
// 8. FORMAT AMOUNT
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
// 9. FORMAT DATE
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
// 10. SAFE VALUE
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
// 11. RESULTS TEXT
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


    if (
        filteredOrders.length === 0
    ) {

        text.textContent =
            "No orders found";

        return;
    }


    const start: number =
        (currentPage - 1) *
        ordersPerPage +
        1;


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
// 12. ERROR
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
}


// =====================================================
// 13. START
// =====================================================

loadOrderHistory();





// PAGINATION 




// =====================================================
// RENDER PAGINATION
// =====================================================

function renderPagination(): void {

    // -------------------------------------------------
    // Get Pagination Container
    // -------------------------------------------------

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


    // -------------------------------------------------
    // Clear Old Buttons
    // -------------------------------------------------

    pagination.innerHTML = "";


    // -------------------------------------------------
    // Calculate Number Of Pages
    // -------------------------------------------------

    const totalPages: number =
        Math.ceil(
            filteredOrders.length /
            ordersPerPage
        );


    // -------------------------------------------------
    // No Need For Pagination
    // -------------------------------------------------

    if (
        totalPages <= 1
    ) {

        return;
    }


    // =================================================
    // PREVIOUS BUTTON
    // =================================================

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


    // =================================================
    // PAGE NUMBERS
    // =================================================

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


    // =================================================
    // NEXT BUTTON
    // =================================================

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

    // -------------------------------------------------
    // Create Button
    // -------------------------------------------------

    const button:
        HTMLButtonElement =
        document.createElement(
            "button"
        );


    // -------------------------------------------------
    // CSS Class
    // -------------------------------------------------

    button.className =
        "page-button";


    // -------------------------------------------------
    // Arrow Class
    // -------------------------------------------------

    if (arrow) {

        button.classList.add(
            "arrow"
        );
    }


    // -------------------------------------------------
    // Active Page
    // -------------------------------------------------

    if (
        page === currentPage
    ) {

        button.classList.add(
            "active"
        );
    }


    // -------------------------------------------------
    // Button Text
    // -------------------------------------------------

    button.textContent =
        text;


    // -------------------------------------------------
    // Click Event
    // -------------------------------------------------

    button.addEventListener(
        "click",
        (): void => {

            // Change current page

            currentPage =
                page;


            // Display orders for new page

            renderOrders();


            // Scroll to top

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


    return button;
}













