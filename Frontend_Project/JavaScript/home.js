// ============================================
// API URLs
// ============================================

const CATEGORIES_API =
    "https://localhost:7299/api/Category/GetSidebarCategories";

const PRODUCTS_API =
    "https://localhost:7299/api/Product/business";


// ============================================
// Business ID
// ============================================

// The products in our database belong to BusinessId = 1
const BUSINESS_ID = 1;


// ============================================
// When the page is loaded
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    // Load Categories
    loadCategories();

    // Load Popular Products
    loadProducts();

});


// ============================================
// LOAD CATEGORIES
// ============================================

async function loadCategories() {

    const container =
        document.getElementById("categories-container");


    // Make sure container exists
    if (!container) {

        console.error(
            "categories-container was not found."
        );

        return;
    }


    try {

        // ========================================
        // Send GET request to Backend
        // ========================================

        const response =
            await fetch(CATEGORIES_API);


        // ========================================
        // Check response
        // ========================================

        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );

        }


        // ========================================
        // Convert response to JavaScript data
        // ========================================

        const categories =
            await response.json();


        // ========================================
        // Remove duplicate categories
        // ========================================

        const uniqueCategories = [];

        const categoryNames = new Set();


        categories.forEach(function (category) {

            // Get category name
            const name =
                category.categoryName?.trim();


            // Ignore empty names
            if (!name) {
                return;
            }


            // Convert to lowercase
            // so Perfumes and perfumes
            // are considered the same
            const key =
                name.toLowerCase();


            // Add only if not already added
            if (!categoryNames.has(key)) {

                categoryNames.add(key);

                uniqueCategories.push(category);

            }

        });


        // ========================================
        // Show ONLY first 3 categories
        // ========================================

        const displayedCategories =
            uniqueCategories.slice(0, 3);


        // ========================================
        // Clear container
        // ========================================

        container.innerHTML = "";


        // ========================================
        // Check if there are no categories
        // ========================================

        if (displayedCategories.length === 0) {

            container.innerHTML = `
                <p>No categories available.</p>
            `;

            return;
        }


        // ========================================
        // Create category cards
        // ========================================

        displayedCategories.forEach(function (category) {


            // Get icon
            const icon =
                getCategoryIcon(
                    category.categoryName
                );


            // Create category card
            const categoryCard = `

                <div
                    class="category-card"
                    onclick="openCategory(${category.categoryId})"
                    style="cursor: pointer;"
                >

                    <i class="${icon}"></i>

                    <p>
                        ${category.categoryName}
                    </p>

                </div>

            `;


            // Add card
            container.insertAdjacentHTML(
                "beforeend",
                categoryCard
            );

        });


    }
    catch (error) {

        console.error(
            "Category Error:",
            error
        );


        container.innerHTML = `

            <p>
                Failed to load categories.
            </p>

        `;

    }

}


// ============================================
// OPEN CATEGORY
// ============================================

function openCategory(categoryId) {

    window.location.href =
        `Products.html?businessId=${BUSINESS_ID}&categoryId=${categoryId}`;

}


// ============================================
// CATEGORY ICONS
// ============================================

function getCategoryIcon(categoryName) {

    const name =
        categoryName.toLowerCase();


    // Perfumes
    if (name.includes("perfume")) {

        return "bi bi-stars";

    }


    // Flowers
    if (name.includes("flower")) {

        return "bi bi-flower1";

    }


    // Chocolate
    if (name.includes("chocolate")) {

        return "bi bi-gift";

    }


    // Food
    if (name.includes("food")) {

        return "bi bi-egg-fried";

    }


    // Fashion
    if (name.includes("fashion")) {

        return "bi bi-handbag";

    }


    // Decor
    if (name.includes("decor")) {

        return "bi bi-palette";

    }


    // Default
    return "bi bi-grid";

}


// ============================================
// LOAD PRODUCTS
// ============================================

async function loadProducts() {

    const container =
        document.getElementById("products-container");


    // Make sure container exists
    if (!container) {

        console.error(
            "products-container was not found."
        );

        return;
    }


    try {

        // ========================================
        // Build API URL
        // ========================================

        const url =
            `${PRODUCTS_API}/${BUSINESS_ID}`;


        // ========================================
        // Send GET request
        // ========================================

        const response =
            await fetch(url);


        // ========================================
        // Check response
        // ========================================

        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        // ========================================
        // Convert JSON to JavaScript
        // ========================================

        const products =
            await response.json();


        // ========================================
        // Remove duplicate products
        // ========================================

        const uniqueProducts = [];

        const productIds = new Set();


        products.forEach(function (product) {

            // Get product ID
            const productId =
                product.productId;


            // Ignore products without ID
            if (!productId) {
                return;
            }


            // Add only unique products
            if (!productIds.has(productId)) {

                productIds.add(productId);

                uniqueProducts.push(product);

            }

        });


        // ========================================
        // Show ONLY first 3 products
        // ========================================

        const displayedProducts =
            uniqueProducts.slice(0, 3);


        // ========================================
        // Clear container
        // ========================================

        container.innerHTML = "";


        // ========================================
        // Check if there are no products
        // ========================================

        if (displayedProducts.length === 0) {

            container.innerHTML = `
                <p>No products available.</p>
            `;

            return;
        }


        // ========================================
        // Create product cards
        // ========================================

        displayedProducts.forEach(function (product) {

            createProductCard(
                product,
                container
            );

        });


    }
    catch (error) {

        console.error(
            "Product Error:",
            error
        );


        container.innerHTML = `

            <p>
                Failed to load products.
            </p>

        `;

    }

}


// ============================================
// CREATE PRODUCT CARD
// ============================================

function createProductCard(
    product,
    container
) {


    // ========================================
    // Product Image
    // ========================================

    let imageUrl =
        "../assets/img/ProductPlaceHolder.png";


    if (product.imageUrl) {

        imageUrl =
            "../assets/img/" +
            product.imageUrl;

    }


    // ========================================
    // Product Rating
    // ========================================

    let rating =
        Number(
            product.averageRating || 0
        );


    rating =
        rating.toFixed(1);


    // ========================================
    // Product Price
    // ========================================

    const price =
        Number(
            product.price || 0
        ).toFixed(3);


    // ========================================
    // Create Product Card
    // ========================================

    const productCard = `

        <article
            class="product-card"
            data-product-id="${product.productId}"
        >


            <!-- ================================= -->
            <!-- Product Image -->
            <!-- ================================= -->

            <div class="product-image">

                <img
                    src="${imageUrl}"
                    alt="${product.productName}"
                >

            </div>


            <!-- ================================= -->
            <!-- Product Information -->
            <!-- ================================= -->

            <div class="product-info">

                <h3>
                    ${product.productName}
                </h3>


                <strong>
                    ${price} OMR
                </strong>


                <p>
                    ⭐ ${rating}
                </p>

            </div>


            <!-- ================================= -->
            <!-- Favorite Button -->
            <!-- ================================= -->

            <i
                class="bi bi-heart product-heart"
                onclick="toggleFavorite(this)"
            ></i>


        </article>

    `;


    // ========================================
    // Add card to container
    // ========================================

    container.insertAdjacentHTML(
        "beforeend",
        productCard
    );

}


// ============================================
// FAVORITE BUTTON
// ============================================

function toggleFavorite(heart) {

    // Empty heart → Filled heart

    if (
        heart.classList.contains("bi-heart")
    ) {

        heart.classList.remove(
            "bi-heart"
        );

        heart.classList.add(
            "bi-heart-fill"
        );

    }

    // Filled heart → Empty heart

    else {

        heart.classList.remove(
            "bi-heart-fill"
        );

        heart.classList.add(
            "bi-heart"
        );

    }

}