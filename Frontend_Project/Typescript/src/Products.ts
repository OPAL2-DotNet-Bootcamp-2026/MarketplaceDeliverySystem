// ============================================================
// TYPES / INTERFACES
// ============================================================

interface Product {
    productId: number;
    productName: string;
    categoryName?: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    isAvailable: boolean;
    description?: string;
}

interface BusinessHeader {
    businessName: string;
    logoUrl?: string;
    openingTime?: string;
    closingTime?: string;
    phoneNumber?: string;
    isOpen: boolean;
    businessCategoryName?: string;
}

interface OrderCartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
    businessId: number | null;
}


// ============================================================
// API URLS
// ============================================================

const BASE_PRODUCTS_API: string =
    "https://localhost:7299/api/Product/business";

const BASE_HEADER_API: string =
    "https://localhost:7299/api/Product/GetBusinessHeader";


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let allProducts: Product[] = [];

let currentCategoryFilter: string = "All";

let productQuantities: Record<number, number> = {};

let currentBusinessId: number | null = null;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async (): Promise<void> => {

        // Read businessId and categoryId from URL
        const urlParams: URLSearchParams =
            new URLSearchParams(window.location.search);

        const businessId: string | null =
            urlParams.get("businessId");

        const categoryId: string | null =
            urlParams.get("categoryId");


        // ====================================================
        // CHECK BUSINESS ID
        // ====================================================

        const productsContainer =
            document.querySelector<HTMLElement>(
                "#products-list-container"
            );

        if (!businessId) {

            if (productsContainer) {

                productsContainer.innerHTML = `
                    <div class="alert alert-warning" role="alert">

                        No business selected.
                        Please return to

                        <a href="/html pages/Businesses.html">
                            Businesses
                        </a>.

                    </div>
                `;
            }

            return;
        }


        // Convert business ID from string to number
        currentBusinessId =
            parseInt(businessId, 10);


        // ====================================================
        // LOAD BUSINESS AND PRODUCTS
        // ====================================================

        await loadBusinessHeader(businessId);

        await loadProducts(
            businessId,
            categoryId
        );
    }
);


// ============================================================
// LOAD BUSINESS HEADER
// ============================================================

async function loadBusinessHeader(
    businessId: string
): Promise<void> {

    const container =
        document.querySelector<HTMLElement>(
            "#business-info-container"
        );

    if (!container) {
        return;
    }


    try {

        // Call backend
        const response: Response =
            await fetch(
                `${BASE_HEADER_API}/${businessId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load business header details."
            );
        }


        // Convert response to BusinessHeader
        const business: BusinessHeader =
            await response.json();


        // ====================================================
        // BUSINESS INFORMATION
        // ====================================================

        const logo: string =
            business.logoUrl ||
            "/assets/img/LogoPlaceHolder.PNG";


        const formattedHours: string =
            formatTimeOnlyRange(
                business.openingTime,
                business.closingTime
            );


        const phone: string =
            business.phoneNumber ||
            "+968 9000 0000";


        // ====================================================
        // RENDER BUSINESS HEADER
        // ====================================================

        container.innerHTML = `

            <div class="card-body p-4">

                <div class="row align-items-center g-3">

                    <!-- BUSINESS LOGO -->
                    <div class="col-auto">

                        <img
                            src="${logo}"
                            class="business-circle-logo"
                            alt="${business.businessName}"
                        >

                    </div>


                    <!-- BUSINESS NAME + HOURS -->
                    <div class="col">

                        <h4
                            class="card-title fw-bold mb-1 text-brand-navy">

                            ${business.businessName}

                        </h4>


                        <span
                            class="badge ${
                                business.isOpen
                                    ? "badge-status-open"
                                    : "badge-status-closed"
                            } small">

                            🕒 Open: ${formattedHours}

                        </span>

                    </div>


                    <!-- PHONE + FAVORITE -->
                    <div
                        class="col-12 col-sm-auto d-flex flex-column gap-2 min-w-action">


                        <!-- PHONE -->
                        <a
                            href="tel:${phone}"
                            class="btn btn-call-brand d-inline-flex align-items-center justify-content-center gap-2">

                            📞 ${phone}

                        </a>


                        <!-- FAVORITE -->
                        <button
                            type="button"
                            class="btn btn-outline-favorite d-inline-flex align-items-center justify-content-center gap-2">

                            ❤️ Add to Favorite

                        </button>


                    </div>

                </div>

            </div>
        `;


        // ====================================================
        // CATEGORY TITLE
        // ====================================================

        const parentCategory =
            document.querySelector<HTMLElement>(
                "#parent-category-title"
            );


        if (parentCategory) {

            parentCategory.textContent =
                business.businessCategoryName ||
                "General";
        }


    } catch (error: unknown) {

        console.error(
            "Header load error:",
            error
        );


        container.innerHTML = `

            <div class="card-body p-3 text-danger">

                Failed to load business details.

            </div>

        `;
    }
}


// ============================================================
// LOAD PRODUCTS
// ============================================================

async function loadProducts(
    businessId: string,
    categoryId: string | null
): Promise<void> {

    const listContainer =
        document.querySelector<HTMLElement>(
            "#products-list-container"
        );


    if (!listContainer) {
        return;
    }


    try {

        // ====================================================
        // BUILD API URL
        // ====================================================

        let url: string =
            `${BASE_PRODUCTS_API}/${businessId}`;


        if (categoryId) {

            url +=
                `?categoryId=${categoryId}`;
        }


        // ====================================================
        // FETCH PRODUCTS
        // ====================================================

        const response: Response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Failed to load products. Status: ${response.status}`
            );
        }


        allProducts =
            await response.json() as Product[];


        // ====================================================
        // UPDATE AVAILABLE ITEMS COUNT
        // ====================================================

        const badge =
            document.querySelector<HTMLElement>(
                "#available-items-badge"
            );


        if (badge) {

            badge.textContent =
                `${allProducts.length} Available Items`;
        }


        // ====================================================
        // NO PRODUCTS
        // ====================================================

        if (allProducts.length === 0) {

            listContainer.innerHTML = `

                <p class="text-muted p-3">

                    No products available for this business.

                </p>

            `;

            return;
        }


        // ====================================================
        // BUILD CATEGORY FILTERS
        // ====================================================

        buildCategoryPills();


        // ====================================================
        // DISPLAY PRODUCTS
        // ====================================================

        renderFilteredProducts();


    } catch (error: unknown) {

        console.error(
            "Products load error:",
            error
        );


        listContainer.innerHTML = `

            <div
                class="alert alert-danger"
                role="alert">

                Unable to load products.
                Please check the backend connection.

            </div>

        `;
    }
}


// ============================================================
// BUILD CATEGORY PILLS
// ============================================================

function buildCategoryPills(): void {

    const pillsContainer =
        document.querySelector<HTMLElement>(
            "#product-pills-container"
        );


    if (!pillsContainer) {
        return;
    }


    // ========================================================
    // GET UNIQUE CATEGORIES
    // ========================================================

    const uniqueCategories: string[] =
        allProducts
            .map(
                (product: Product): string | undefined =>
                    product.categoryName
            )
            .filter(
                (
                    category: string | undefined
                ): category is string =>
                    Boolean(category)
            );


    const categories: string[] = [
        "All",
        ...new Set(uniqueCategories)
    ];


    // ========================================================
    // CREATE PILLS
    // ========================================================

    pillsContainer.innerHTML =
        categories
            .map(
                (
                    category: string,
                    index: number
                ): string => {

                    return `
                        <a
                            href="#"
                            class="subcategory-pill ${
                                index === 0
                                    ? "active"
                                    : ""
                            }"
                            data-cat="${category}">

                            ${category === "All"
                                ? "All"
                                : category}

                        </a>
                    `;
                }
            )
            .join("");


    // ========================================================
    // ADD CLICK EVENTS
    // ========================================================

    const pills =
        pillsContainer.querySelectorAll<HTMLAnchorElement>(
            ".subcategory-pill"
        );


    pills.forEach(
        (pill: HTMLAnchorElement): void => {

            pill.addEventListener(
                "click",
                (event: MouseEvent): void => {

                    event.preventDefault();


                    // Remove active from all pills
                    pills.forEach(
                        (
                            currentPill: HTMLAnchorElement
                        ): void => {

                            currentPill.classList.remove(
                                "active"
                            );
                        }
                    );


                    // Activate selected pill
                    pill.classList.add("active");


                    // Get selected category
                    currentCategoryFilter =
                        pill.getAttribute(
                            "data-cat"
                        ) || "All";


                    // Render filtered products
                    renderFilteredProducts();
                }
            );
        }
    );
}


// ============================================================
// RENDER FILTERED PRODUCTS
// ============================================================

function renderFilteredProducts(): void {

    const listContainer =
        document.querySelector<HTMLElement>(
            "#products-list-container"
        );


    const modalsContainer =
        document.querySelector<HTMLElement>(
            "#product-modals-container"
        );


    if (!listContainer) {
        return;
    }


    // Clear existing products
    listContainer.innerHTML = "";


    // Clear existing modals
    if (modalsContainer) {

        modalsContainer.innerHTML = "";
    }


    // ========================================================
    // FILTER PRODUCTS
    // ========================================================

    const filteredProducts: Product[] =
        currentCategoryFilter === "All"
            ? allProducts
            : allProducts.filter(
                (product: Product): boolean =>
                    product.categoryName ===
                    currentCategoryFilter
            );


    // ========================================================
    // NO PRODUCTS IN CATEGORY
    // ========================================================

    if (filteredProducts.length === 0) {

        listContainer.innerHTML = `

            <p class="text-muted p-3">

                No products in this category.

            </p>

        `;

        return;
    }


    // ========================================================
    // CREATE PRODUCT CARDS
    // ========================================================

    filteredProducts.forEach(
        (product: Product): void => {


            // ==================================================
            // INITIALIZE QUANTITY
            // ==================================================

            if (
                productQuantities[
                    product.productId
                ] === undefined
            ) {

                productQuantities[
                    product.productId
                ] = 0;
            }


            const quantity: number =
                productQuantities[
                    product.productId
                ];


            // ==================================================
            // PRODUCT IMAGE
            // ==================================================

            const image: string =
                product.imageUrl ||
                "/assets/img/ProductPlaceHolder.PNG";


            // ==================================================
            // PRICE
            // ==================================================

            const formattedPrice: string =
                Number(product.price).toFixed(3);


            const totalPrice: string =
                (
                    product.price *
                    quantity
                ).toFixed(3);


            // ==================================================
            // STOCK BADGE
            // ==================================================

            const stockBadge: string =
                product.stockQuantity <= 8

                    ? `
                        <span class="stock-tag-low">

                            ⚠️ Only
                            ${product.stockQuantity}
                            remaining

                        </span>
                    `

                    : `
                        <span class="stock-tag-good">

                            ✓
                            ${product.stockQuantity}
                            remaining

                        </span>
                    `;


            // ==================================================
            // PRODUCT CARD
            // ==================================================

            const cardHtml: string = `

                <div
                    class="card product-horizontal-card shadow-sm">

                    <div class="card-body p-3">

                        <div
                            class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-sm-nowrap">


                            <!-- CLICKABLE PRODUCT INFORMATION -->

                            <div
                                class="d-flex align-items-center gap-3 cursor-pointer"

                                data-bs-toggle="modal"

                                data-bs-target="#modalProduct-${product.productId}"

                                style="cursor: pointer; flex-grow: 1;">


                                <!-- IMAGE -->

                                <img
                                    src="${image}"
                                    class="product-card-img flex-shrink-0"
                                    alt="${product.productName}">


                                <!-- PRODUCT DETAILS -->

                                <div
                                    class="d-flex flex-column justify-content-center">

                                    <h5
                                        class="product-card-title mb-1">

                                        ${product.productName}

                                    </h5>


                                    <div
                                        class="price-tag fw-bold mb-1">

                                        ${formattedPrice} OMR

                                    </div>


                                    <div>

                                        ${stockBadge}

                                    </div>

                                </div>

                            </div>


                            <!-- QUANTITY + ADD BUTTONS -->

                            <div
                                class="d-flex align-items-center gap-2 ms-auto ms-sm-0">


                                <!-- DECREASE -->

                                <button
                                    type="button"
                                    class="btn qty-box-btn"

                                    onclick="updateQuantity(
                                        ${product.productId},
                                        -1,
                                        ${product.stockQuantity},
                                        ${product.price}
                                    )">

                                    -

                                </button>


                                <!-- QUANTITY -->

                                <div
                                    id="card-qty-${product.productId}"
                                    class="qty-box-val"
                                    aria-live="polite">

                                    ${quantity}

                                </div>


                                <!-- INCREASE -->

                                <button
                                    type="button"
                                    class="btn qty-box-btn"

                                    onclick="updateQuantity(
                                        ${product.productId},
                                        1,
                                        ${product.stockQuantity},
                                        ${product.price}
                                    )">

                                    +

                                </button>


                                <!-- ADD TO ORDER -->

                                <button
                                    type="button"
                                    class="btn btn-add-order d-inline-flex align-items-center gap-1"

                                    onclick="addProductToOrder(
                                        ${product.productId},
                                        '${product.productName}'
                                    )">

                                    Add to Order

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            `;


            listContainer.insertAdjacentHTML(
                "beforeend",
                cardHtml
            );


            // ==================================================
            // PRODUCT MODAL
            // ==================================================

            if (modalsContainer) {

                const modalHtml: string = `

                    <div
                        class="modal fade product-modal"
                        id="modalProduct-${product.productId}"
                        tabindex="-1"
                        aria-hidden="true">


                        <div
                            class="modal-dialog modal-dialog-centered modal-lg">


                            <div class="modal-content">


                                <!-- MODAL HEADER -->

                                <div
                                    class="modal-header d-flex align-items-center justify-content-between">


                                    <h5 class="modal-category-title">

                                        [
                                        ${
                                            product.categoryName ||
                                            "General"
                                        }
                                        ]

                                    </h5>


                                    <button
                                        type="button"
                                        class="btn modal-close-btn"
                                        data-bs-dismiss="modal">

                                        ✕

                                    </button>

                                </div>


                                <!-- MODAL BODY -->

                                <div class="modal-body p-4">

                                    <div
                                        class="row g-4 align-items-start">


                                        <!-- PRODUCT IMAGE -->

                                        <div
                                            class="col-12 col-md-5">

                                            <img
                                                src="${image}"
                                                class="img-fluid modal-product-img"
                                                alt="${product.productName}">

                                        </div>


                                        <!-- PRODUCT INFORMATION -->

                                        <div
                                            class="col-12 col-md-7 d-flex flex-column gap-2">


                                            <!-- TITLE -->

                                            <div>

                                                <small
                                                    class="text-muted text-uppercase fw-semibold">

                                                    Product Title

                                                </small>


                                                <h3
                                                    class="fw-bold mb-1 text-brand-navy">

                                                    ${product.productName}

                                                </h3>

                                            </div>


                                            <!-- PRICE -->

                                            <div>

                                                <small
                                                    class="text-muted fw-semibold">

                                                    Price

                                                </small>


                                                <div
                                                    class="fs-4 fw-bold text-brand-orange">

                                                    ${formattedPrice} OMR

                                                </div>

                                            </div>


                                            <!-- AVAILABILITY -->

                                            <div>

                                                <small
                                                    class="text-muted fw-semibold d-block mb-1">

                                                    Available and Stock

                                                </small>


                                                <span
                                                    class="badge rounded-pill me-2 badge-brand-count">

                                                    [
                                                    ${
                                                        product.isAvailable
                                                            ? "Available"
                                                            : "Unavailable"
                                                    }
                                                    ]

                                                </span>


                                                <span
                                                    class="${
                                                        product.stockQuantity <= 8
                                                            ? "stock-tag-low"
                                                            : "stock-tag-good"
                                                    }">

                                                    [
                                                    ${product.stockQuantity}
                                                    remaining
                                                    ]

                                                </span>

                                            </div>


                                            <!-- DESCRIPTION -->

                                            <div class="mt-2">

                                                <h6
                                                    class="fw-bold mb-1 text-brand-navy">

                                                    Description

                                                </h6>


                                                <p
                                                    class="text-muted small mb-0 modal-description-text">

                                                    ${
                                                        product.description ||
                                                        "No description provided for this product."
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                <!-- MODAL FOOTER -->

                                <div
                                    class="modal-footer d-flex align-items-center justify-content-between flex-wrap gap-3">


                                    <!-- QUANTITY SECTION -->

                                    <div
                                        class="d-flex flex-column gap-2">


                                        <div
                                            class="d-flex align-items-center gap-2">


                                            <span
                                                class="fw-bold me-1 text-brand-navy">

                                                Quantity:

                                            </span>


                                            <!-- DECREASE -->

                                            <button
                                                type="button"
                                                class="btn qty-box-btn"

                                                onclick="updateQuantity(
                                                    ${product.productId},
                                                    -1,
                                                    ${product.stockQuantity},
                                                    ${product.price}
                                                )">

                                                -

                                            </button>


                                            <!-- QUANTITY -->

                                            <div
                                                id="modal-qty-${product.productId}"
                                                class="qty-box-val">

                                                ${quantity}

                                            </div>


                                            <!-- INCREASE -->

                                            <button
                                                type="button"
                                                class="btn qty-box-btn"

                                                onclick="updateQuantity(
                                                    ${product.productId},
                                                    1,
                                                    ${product.stockQuantity},
                                                    ${product.price}
                                                )">

                                                +

                                            </button>

                                        </div>


                                        <!-- CANCEL -->

                                        <div>

                                            <button
                                                type="button"
                                                class="btn btn-cancel"
                                                data-bs-dismiss="modal">

                                                Cancel

                                            </button>

                                        </div>

                                    </div>


                                    <!-- TOTAL + ADD -->

                                    <div
                                        class="d-flex flex-column align-items-end gap-2">


                                        <!-- TOTAL -->

                                        <div
                                            class="fs-5 fw-bold text-brand-navy">

                                            Total:

                                            <span
                                                id="modal-total-${product.productId}"
                                                class="text-brand-orange">

                                                ${totalPrice} OMR

                                            </span>

                                        </div>


                                        <!-- ADD -->

                                        <button
                                            type="button"
                                            class="btn btn-add-order"
                                            data-bs-dismiss="modal"

                                            onclick="addProductToOrder(
                                                ${product.productId},
                                                '${product.productName}'
                                            )">

                                            Add to order

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                `;


                modalsContainer.insertAdjacentHTML(
                    "beforeend",
                    modalHtml
                );
            }
        }
    );
}


// ============================================================
// UPDATE PRODUCT QUANTITY
// ============================================================

function updateQuantity(
    productId: number,
    delta: number,
    maxStock: number,
    unitPrice: number
): void {

    // Get current quantity
    let currentQuantity: number =
        productQuantities[productId] ?? 0;


    // Apply change
    currentQuantity += delta;


    // Prevent negative quantity
    if (currentQuantity < 0) {

        currentQuantity = 0;
    }


    // Prevent quantity above stock
    if (currentQuantity > maxStock) {

        currentQuantity = maxStock;
    }


    // Save quantity
    productQuantities[productId] =
        currentQuantity;


    // ========================================================
    // UPDATE CARD QUANTITY
    // ========================================================

    const cardQuantity =
        document.querySelector<HTMLElement>(
            `#card-qty-${productId}`
        );


    if (cardQuantity) {

        cardQuantity.textContent =
            currentQuantity.toString();
    }


    // ========================================================
    // UPDATE MODAL QUANTITY
    // ========================================================

    const modalQuantity =
        document.querySelector<HTMLElement>(
            `#modal-qty-${productId}`
        );


    if (modalQuantity) {

        modalQuantity.textContent =
            currentQuantity.toString();
    }


    // ========================================================
    // UPDATE MODAL TOTAL
    // ========================================================

    const modalTotal =
        document.querySelector<HTMLElement>(
            `#modal-total-${productId}`
        );


    if (modalTotal) {

        const total: string =
            (
                unitPrice *
                currentQuantity
            ).toFixed(3);


        modalTotal.textContent =
            `${total} OMR`;
    }
}


// ============================================================
// ADD PRODUCT TO ORDER
// ============================================================

function addProductToOrder(
    productId: number,
    productName: string
): void {

    // ========================================================
    // FIND PRODUCT
    // ========================================================

    const product: Product | undefined =
        allProducts.find(
            (item: Product): boolean =>
                item.productId === productId
        );


    if (!product) {
        return;
    }


    // ========================================================
    // GET SELECTED QUANTITY
    // ========================================================

    const quantity: number =
        productQuantities[productId] ?? 0;


    // ========================================================
    // CHECK QUANTITY
    // ========================================================

    if (quantity === 0) {

        alert(
            "Please select at least 1 item."
        );

        return;
    }


    // ========================================================
    // GET CART FROM LOCAL STORAGE
    // ========================================================

    const savedCart: string | null =
        localStorage.getItem("orderCart");


    let cart: OrderCartItem[] = [];


    try {

        cart = savedCart
            ? JSON.parse(savedCart) as OrderCartItem[]
            : [];

    } catch (error: unknown) {

        console.error(
            "Error reading order cart:",
            error
        );

        cart = [];
    }


    // ========================================================
    // CHECK IF PRODUCT ALREADY EXISTS
    // ========================================================

    const existingIndex: number =
        cart.findIndex(
            (
                item: OrderCartItem
            ): boolean =>
                item.productId === productId
        );


    // ========================================================
    // UPDATE EXISTING PRODUCT
    // ========================================================

    if (existingIndex > -1) {

        cart[existingIndex].quantity +=
            quantity;

    }

    // ========================================================
    // ADD NEW PRODUCT
    // ========================================================

    else {

        cart.push({

            productId:
                product.productId,

            productName:
                product.productName,

            price:
                product.price,

            quantity:
                quantity,

            imageUrl:
                product.imageUrl ||
                "/assets/img/ProductPlaceHolder.PNG",

            businessId:
                currentBusinessId
        });
    }


    // ========================================================
    // SAVE CART
    // ========================================================

    localStorage.setItem(
        "orderCart",
        JSON.stringify(cart)
    );


    // ========================================================
    // CONFIRM TO USER
    // ========================================================

    alert(
        `Added ${quantity}x "${productName}" to your order!`
    );
}


// ============================================================
// FORMAT BUSINESS OPENING / CLOSING TIME
// ============================================================

function formatTimeOnlyRange(
    openingStr?: string,
    closingStr?: string
): string {

    if (!openingStr || !closingStr) {

        return "Closed";
    }


    // ========================================================
    // FORMAT ONE TIME
    // ========================================================

    const formatSingleTime = (
        timeStr: string
    ): string => {

        const parts: string[] =
            timeStr.split(":");


        let hours: number =
            parseInt(
                parts[0],
                10
            );


        const minutes: string =
            parts[1] || "00";


        const ampm: string =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12;


        hours =
            hours
                ? hours
                : 12;


        return `${hours}:${minutes} ${ampm}`;
    };


    return `
        ${formatSingleTime(openingStr)}
        -
        ${formatSingleTime(closingStr)}
    `.trim();
}


// ============================================================
// WINDOW DECLARATIONS
// ============================================================
//
// Your generated HTML uses:
//
// onclick="updateQuantity(...)"
//
// and:
//
// onclick="addProductToOrder(...)"
//
// Therefore, expose these functions through window.
// ============================================================

(window as any).updateQuantity = updateQuantity;
(window as any).addProductToOrder = addProductToOrder;
