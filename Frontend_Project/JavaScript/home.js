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

    loadCategories();

    loadProducts();

});


// ============================================
// Load Categories
// ============================================

async function loadCategories() {

    const container =
        document.getElementById("categories-container");


    try {

        // Send GET request to Backend

        const response =
            await fetch(CATEGORIES_API);


        // Check if request was successful

        if (!response.ok) {

            throw new Error("Failed to load categories");

        }


        // Convert response to JavaScript data

        const categories =
            await response.json();


        // Clear container

        container.innerHTML = "";


        // Check if there are no categories

        if (categories.length === 0) {

            container.innerHTML =
                "<p>No categories available.</p>";

            return;

        }


        // Loop through categories

        categories.forEach(function (category) {


            // Get icon for this category

            const icon =
                getCategoryIcon(category.categoryName);


            // Create category card

            const categoryCard = `

                <div class="category-card">

                    <i class="${icon}"></i>

                    <p>
                        ${category.categoryName}
                    </p>

                </div>

            `;


            // Add card to page

            container.innerHTML += categoryCard;

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
// Category Icons
// ============================================

function getCategoryIcon(categoryName) {

    const name =
        categoryName.toLowerCase();


    if (name.includes("perfume")) {

        return "bi bi-stars";

    }


    if (name.includes("flower")) {

        return "bi bi-flower1";

    }


    if (name.includes("chocolate")) {

        return "bi bi-gift";

    }


    if (name.includes("food")) {

        return "bi bi-egg-fried";

    }


    if (name.includes("fashion")) {

        return "bi bi-handbag";

    }


    if (name.includes("decor")) {

        return "bi bi-palette";

    }


    // Default icon

    return "bi bi-grid";

}


// ============================================
// Load Products
// ============================================

async function loadProducts() {

    const container =
        document.getElementById("products-container");


    try {

        // Build API URL

        const url =
            `${PRODUCTS_API}/${BUSINESS_ID}`;


        // Send GET request

        const response =
            await fetch(url);


        // Check response

        if (!response.ok) {

            throw new Error("Failed to load products");

        }


        // Convert JSON to JavaScript

        const products =
            await response.json();


        // Clear container

        container.innerHTML = "";


        // Check if there are no products

        if (products.length === 0) {

            container.innerHTML =
                "<p>No products available.</p>";

            return;

        }


        // Loop through products

        products.forEach(function (product) {

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
// Create Product Card
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
            "../assets/img/" + product.imageUrl;

    }


    // ========================================
    // Product Rating
    // ========================================

    let rating =
        Number(product.averageRating || 0);


    rating =
        rating.toFixed(1);


    // ========================================
    // Create HTML
    // ========================================

    const productCard = `

        <article
            class="product-card"
            data-product-id="${product.productId}"
        >


            <div class="product-image">

                <img
                    src="${imageUrl}"
                    alt="${product.productName}"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${product.productName}
                </h3>


                <strong>
                    ${Number(product.price).toFixed(3)} OMR
                </strong>


                <p>

                    ⭐ ${rating}

                </p>

            </div>


            <i
                class="bi bi-heart product-heart"
                onclick="toggleFavorite(this)"
            ></i>


        </article>

    `;


    // Add product to container

    container.innerHTML += productCard;

}


// ============================================
// Favorite Button
// ============================================

function toggleFavorite(heart) {

    // Change empty heart to filled heart

    if (heart.classList.contains("bi-heart")) {

        heart.classList.remove("bi-heart");

        heart.classList.add("bi-heart-fill");

    }
    else {

        heart.classList.remove("bi-heart-fill");

        heart.classList.add("bi-heart");

    }

}