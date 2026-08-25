const BASE_PRODUCTS_API = "https://localhost:7299/api/Product/business";
const BASE_HEADER_API = "https://localhost:7299/api/Product/GetBusinessHeader";

let allProducts = [];
let currentCategoryFilter = "All";
let productQuantities = {}; // Tracks { [productId]: quantity }

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Read ?businessId=X from current URL
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get("businessId");

    if (!businessId) {
        document.querySelector("#products-list-container").innerHTML = `
            <div class="alert alert-warning" role="alert">
                No business selected. Please return to <a href="/html pages/Businesses.html">Businesses</a>.
            </div>
        `;
        return;
    }

    // 2. Load business details and products
    await loadBusinessHeader(businessId);
    await loadProducts(businessId);
});

// Fetches & renders the Top Business Header Card
async function loadBusinessHeader(businessId) {
    const container = document.querySelector("#business-info-container");

    try {
        const response = await fetch(`${BASE_HEADER_API}/${businessId}`);
        if (!response.ok) throw new Error("Failed to load business header details.");

        const b = await response.json();
        const logo = b.logoUrl || "/assets/img/UmShakir logo-01.jpg";
        const formattedHours = formatTimeOnlyRange(b.openingTime, b.closingTime);
        const phone = b.phoneNumber || "+968 9000 0000";

        container.innerHTML = `
            <div class="card-body p-4">
                <div class="row align-items-center g-3">
                    <div class="col-auto">
                        <img src="${logo}" class="business-circle-logo" alt="${b.businessName}">
                    </div>
                    <div class="col">
                        <h4 class="card-title fw-bold mb-1 text-brand-navy">
                            ${b.businessName}
                        </h4>
                        <span class="badge ${b.isOpen ? 'badge-status-open' : 'badge-status-closed'} small">
                            🕒 Open: ${formattedHours}
                        </span>
                    </div>
                    <div class="col-12 col-sm-auto d-flex flex-column gap-2 min-w-action">
                        <a href="tel:${phone}" class="btn btn-call-brand d-inline-flex align-items-center justify-content-center gap-2">
                            📞 ${phone}
                        </a>
                        <button type="button" class="btn btn-outline-favorite d-inline-flex align-items-center justify-content-center gap-2">
                            ❤️ Add to Favorite
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Header load error:", err);
        container.innerHTML = `
            <div class="card-body p-3 text-danger">Failed to load business details.</div>
        `;
    }
}

// Fetches the product list using your existing GetProductsByBusiness method
async function loadProducts(businessId) {
    const listContainer = document.querySelector("#products-list-container");

    try {
        const response = await fetch(`${BASE_PRODUCTS_API}/${businessId}`);
        if (!response.ok) throw new Error("Failed to load products.");

        allProducts = await response.json();

        // Update items count
        const badge = document.querySelector("#available-items-badge");
        if (badge) badge.textContent = `${allProducts.length} Available Items`;

        if (allProducts.length === 0) {
            listContainer.innerHTML = `<p class="text-muted p-3">No products available for this business.</p>`;
            return;
        }

        // Set parent category text from first available product's category
        const parentCatSpan = document.querySelector("#parent-category-title");
        if (parentCatSpan && allProducts[0].categoryName) {
            parentCatSpan.textContent = allProducts[0].categoryName;
        }

        // Build pills and render cards
        buildCategoryPills();
        renderFilteredProducts();

    } catch (err) {
        console.error("Products load error:", err);
        listContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Unable to load products. Please check the backend connection.
            </div>
        `;
    }
}

// Builds the category filter pills (All, Main Dishes, etc.)
function buildCategoryPills() {
    const pillsContainer = document.querySelector("#product-pills-container");
    if (!pillsContainer) return;

    // Extract unique categories from product list
    const categories = ["All", ...new Set(allProducts.map(p => p.categoryName).filter(Boolean))];

    pillsContainer.innerHTML = categories.map((cat, index) => `
        <a href="#" class="subcategory-pill ${index === 0 ? 'active' : ''}" data-cat="${cat}">
            ${cat === "All" ? "All" : cat}
        </a>
    `).join("");

    pillsContainer.querySelectorAll(".subcategory-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
            e.preventDefault();
            pillsContainer.querySelectorAll(".subcategory-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            currentCategoryFilter = pill.getAttribute("data-cat");
            renderFilteredProducts();
        });
    });
}

// Renders the horizontal product cards & generates corresponding modals
function renderFilteredProducts() {
    const listContainer = document.querySelector("#products-list-container");
    const modalsContainer = document.querySelector("#product-modals-container");

    listContainer.innerHTML = "";
    modalsContainer.innerHTML = "";

    const filtered = currentCategoryFilter === "All"
        ? allProducts
        : allProducts.filter(p => p.categoryName === currentCategoryFilter);

    if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="text-muted p-3">No products in this category.</p>`;
        return;
    }

    filtered.forEach(product => {
        if (!productQuantities[product.productId]) {
            productQuantities[product.productId] = 1;
        }

        const qty = productQuantities[product.productId];
        const img = product.imageUrl || "/assets/img/MeatKabuli.jpg";
        const priceFormatted = Number(product.price).toFixed(3);
        const totalPrice = (product.price * qty).toFixed(3);

        const stockBadge = product.stockQuantity <= 8
            ? `<span class="stock-tag-low">⚠️ Only ${product.stockQuantity} remaining</span>`
            : `<span class="stock-tag-good">✓ ${product.stockQuantity} remaining</span>`;

        // 1. Horizontal Product Card
        const cardHtml = `
            <div class="card product-horizontal-card shadow-sm">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-sm-nowrap">
                        <!-- Click image/title to open modal -->
                        <div class="d-flex align-items-center gap-3 cursor-pointer" 
                             data-bs-toggle="modal" data-bs-target="#modalProduct-${product.productId}" style="cursor: pointer;">
                            <img src="${img}" class="product-card-img flex-shrink-0" alt="${product.productName}">
                            <div class="d-flex flex-column justify-content-center">
                                <h5 class="product-card-title mb-1">${product.productName}</h5>
                                <div class="price-tag fw-bold mb-1">${priceFormatted} OMR</div>
                                <div>${stockBadge}</div>
                            </div>
                        </div>

                        <!-- Quantity Selector and Action -->
                        <div class="d-flex align-items-center gap-2 ms-auto ms-sm-0">
                            <button type="button" class="btn qty-box-btn" onclick="updateQuantity(${product.productId}, -1, ${product.stockQuantity}, ${product.price})">-</button>
                            <div id="card-qty-${product.productId}" class="qty-box-val" aria-live="polite">${qty}</div>
                            <button type="button" class="btn qty-box-btn" onclick="updateQuantity(${product.productId}, 1, ${product.stockQuantity}, ${product.price})">+</button>
                            <button type="button" class="btn btn-add-order d-inline-flex align-items-center gap-1" onclick="addProductToOrder(${product.productId}, '${product.productName}')">
                                Add to Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML("beforeend", cardHtml);

        // 2. Detailed Modal Popup
        const modalHtml = `
            <div class="modal fade product-modal" id="modalProduct-${product.productId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header d-flex align-items-center justify-content-between">
                            <h5 class="modal-category-title">[ ${product.categoryName || 'General'} ]</h5>
                            <button type="button" class="btn modal-close-btn" data-bs-dismiss="modal">✕</button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="row g-4 align-items-start">
                                <div class="col-12 col-md-5">
                                    <img src="${img}" class="img-fluid modal-product-img" alt="${product.productName}">
                                </div>
                                <div class="col-12 col-md-7 d-flex flex-column gap-2">
                                    <div>
                                        <small class="text-muted text-uppercase fw-semibold">Product Title</small>
                                        <h3 class="fw-bold mb-1 text-brand-navy">${product.productName}</h3>
                                    </div>
                                    <div>
                                        <small class="text-muted fw-semibold">Price</small>
                                        <div class="fs-4 fw-bold text-brand-orange">${priceFormatted} OMR</div>
                                    </div>
                                    <div>
                                        <small class="text-muted fw-semibold d-block mb-1">Available and Stock</small>
                                        <span class="badge rounded-pill me-2 badge-brand-count">[ ${product.isAvailable ? 'Available' : 'Unavailable'} ]</span>
                                        <span class="${product.stockQuantity <= 8 ? 'stock-tag-low' : 'stock-tag-good'}">[ ${product.stockQuantity} remaining ]</span>
                                    </div>
                                    <div class="mt-2">
                                        <h6 class="fw-bold mb-1 text-brand-navy">Description</h6>
                                        <p class="text-muted small mb-0 modal-description-text">
                                            ${product.description || 'No description provided for this product.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div class="d-flex flex-column gap-2">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold me-1 text-brand-navy">Quantity:</span>
                                    <button type="button" class="btn qty-box-btn" onclick="updateQuantity(${product.productId}, -1, ${product.stockQuantity}, ${product.price})">-</button>
                                    <div id="modal-qty-${product.productId}" class="qty-box-val">${qty}</div>
                                    <button type="button" class="btn qty-box-btn" onclick="updateQuantity(${product.productId}, 1, ${product.stockQuantity}, ${product.price})">+</button>
                                </div>
                                <div><button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancel</button></div>
                            </div>
                            <div class="d-flex flex-column align-items-end gap-2">
                                <div class="fs-5 fw-bold text-brand-navy">Total: <span id="modal-total-${product.productId}" class="text-brand-orange">${totalPrice} OMR</span></div>
                                <button type="button" class="btn btn-add-order" data-bs-dismiss="modal" onclick="addProductToOrder(${product.productId}, '${product.productName}')">Add to order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalsContainer.insertAdjacentHTML("beforeend", modalHtml);
    });
}

// Global Quantity handler (syncs both the card and modal counters)
window.updateQuantity = function (productId, delta, maxStock, unitPrice) {
    let current = productQuantities[productId] || 1;
    current += delta;

    if (current < 1) current = 1;
    if (current > maxStock) current = maxStock;

    productQuantities[productId] = current;

    // Update card counter
    const cardQty = document.querySelector(`#card-qty-${productId}`);
    if (cardQty) cardQty.textContent = current;

    // Update modal counter & total price
    const modalQty = document.querySelector(`#modal-qty-${productId}`);
    if (modalQty) modalQty.textContent = current;

    const modalTotal = document.querySelector(`#modal-total-${productId}`);
    if (modalTotal) modalTotal.textContent = `${(unitPrice * current).toFixed(3)} OMR`;
};

window.addProductToOrder = function (productId, productName) {
    const qty = productQuantities[productId] || 1;
    alert(`Added ${qty}x "${productName}" to order!`);
};


window.addProductToOrder = function(productId, productName) {
    const product = allProducts.find(p => p.productId === productId);
    if (!product) return;

    const qty = productQuantities[productId] || 1;

    // 1. Read existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem("orderCart") || "[]");

    // 2. Check if product already exists in cart
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            quantity: qty,
            imageUrl: product.imageUrl || "/assets/img/MeatKabuli.jpg",
            businessId: product.businessId || (currentBusinessData ? currentBusinessData.businessId : null)
        });
    }

    // 3. Save back to localStorage
    localStorage.setItem("orderCart", JSON.stringify(cart));

    alert(`Added ${qty}x "${productName}" to your order!`);
};


function formatTimeOnlyRange(openingStr, closingStr) {
    if (!openingStr || !closingStr) return "Closed";

    const formatSingleTime = (timeStr) => {
        const parts = timeStr.split(":");
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || "00";
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    return `${formatSingleTime(openingStr)} - ${formatSingleTime(closingStr)}`;
}