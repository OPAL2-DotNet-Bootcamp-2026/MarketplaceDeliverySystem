
console.log("Home.js is working");


// =====================================================
// API
// =====================================================

const API_URL =
    "https://localhost:7299/api/Product/FilterProducts";


// =====================================================
// WHEN PAGE LOADS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Home page loaded");

    loadHomeProducts();

});


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadHomeProducts() {

    const productsContainer =
        document.getElementById("products-container");

    const categoriesContainer =
        document.getElementById("categories-container");


    try {

        console.log("Calling API...");


        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({})

        });


        console.log(
            "Response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "API returned status " +
                response.status
            );

        }


        const products =
            await response.json();


        console.log(
            "Products:",
            products
        );


        if (!Array.isArray(products)) {

            throw new Error(
                "API response is not an array"
            );

        }


        // =============================================
        // DISPLAY PRODUCTS
        // =============================================

        displayProducts(products);


        // =============================================
        // DISPLAY CATEGORIES
        // =============================================

        displayCategories(products);


    }
    catch (error) {

        console.error(
            "Home API Error:",
            error
        );


        productsContainer.innerHTML = `

            <div class="home-error">

                <i class="bi bi-exclamation-circle"></i>

                <p>
                    Unable to load products.
                </p>

                <button
                    class="retry-btn"
                    onclick="loadHomeProducts()">

                    Try Again

                </button>

            </div>

        `;


        categoriesContainer.innerHTML = `

            <div class="home-error">

                Unable to load categories.

            </div>

        `;

    }

}



// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(products) {

    const container =
        document.getElementById(
            "products-container"
        );


    container.innerHTML = "";


    console.log(
        "Number of products:",
        products.length
    );


    // Show maximum 4 products

    const popularProducts =
        products.slice(0, 4);


    popularProducts.forEach(function (product) {


        const card =
            document.createElement("article");


        card.className =
            "product-card";


        // =============================================
        // IMAGE
        // =============================================



      let imageUrl = product.imageUrl;

         if (imageUrl) {
       imageUrl = "../assets/img/" + imageUrl;
         } else {
       imageUrl = "../assets/img/ProductThumbnail.png";
           }


        // =============================================
        // RATING
        // =============================================

        const rating =
            Number(
                product.averageRating || 0
            ).toFixed(1);


        // =============================================
        // CARD HTML
        // =============================================

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${imageUrl}"
                    alt="${product.productName || "Product"}"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${product.productName || "Product"}
                </h3>


                <strong>
                    ${Number(product.price || 0).toFixed(3)}
                    OMR
                </strong>


                <p>

                    ⭐ ${rating}

                    <span>
                        ${product.businessName || ""}
                    </span>

                </p>

            </div>


            <button
                class="product-heart"
                type="button">

                <i class="bi bi-heart"></i>

            </button>

        `;


        // =============================================
        // HEART
        // =============================================

        const heart =
            card.querySelector(
                ".product-heart"
            );


        heart.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                heart.classList.toggle(
                    "favorite-active"
                );


                const icon =
                    heart.querySelector("i");


                icon.classList.toggle(
                    "bi-heart"
                );


                icon.classList.toggle(
                    "bi-heart-fill"
                );

            }
        );


        // =============================================
        // CLICK PRODUCT
        // =============================================

        card.addEventListener(
            "click",
            function () {

                console.log(
                    "Clicked product:",
                    product.productId
                );

            }
        );


        container.appendChild(card);

    });


    // =============================================
    // NO PRODUCTS
    // =============================================

    if (products.length === 0) {

        container.innerHTML = `

            <div class="home-empty">

                <i class="bi bi-box-seam"></i>

                <p>
                    No products available.
                </p>

            </div>

        `;

    }

}



// =====================================================
// DISPLAY CATEGORIES
// =====================================================

/* displayCategories(products) {

    const container =
        document.getElementById(
            "categories-container"
        );


    container.innerHTML = "";


    // =============================================
    // GET CATEGORY NAMES
    // =============================================

    const categoryNames = [];


    products.forEach(function (product) {


        const category =
            product.categoryName;


        if (
            category &&
            !categoryNames.includes(category)
        ) {

            categoryNames.push(category);

        }

    });


    console.log(
        "Categories:",
        categoryNames
    );


    // =============================================
    // ICONS
    // =============================================

    const icons = [

        "bi-egg-fried",

        "bi-stars",

        "bi-flower1",

        "bi-gift",

        "bi-handbag",

        "bi-palette",

        "bi-three-dots"

    ];


    // =============================================
    // CREATE CATEGORY CARDS
    // =============================================

    categoryNames
        .slice(0, 7)
        .forEach(function (category, index) {


            const card =
                document.createElement("div");


            card.className =
                "category-card";


            card.innerHTML = `

                <i class="bi ${icons[index]}"></i>

                <p>
                    ${category}
                </p>

            `;


            card.addEventListener(
                "click",
                function () {

                    console.log(
                        "Selected category:",
                        category
                    );


                    window.location.href =
                        "Products.html?category=" +
                        encodeURIComponent(category);

                }
            ); 


            container.appendChild(card);

        });


    // =============================================
    // NO CATEGORIES
    // =============================================

    if (categoryNames.length === 0) {

        container.innerHTML = `

            <div class="home-empty">

                No categories found.

            </div>

        `;

    }

}

*/


// =====================================================
// DISPLAY CATEGORIES
// =====================================================

function displayCategories(products) {

    const container =
        document.getElementById("categories-container");


    // Clear old categories
    container.innerHTML = "";


    // =============================================
    // GET UNIQUE CATEGORY NAMES FROM API
    // =============================================

    const categoryNames = [];


    products.forEach(function (product) {

        const category =
            product.categoryName;


        if (
            category &&
            !categoryNames.includes(category)
        ) {

            categoryNames.push(category);

        }

    });


    console.log(
        "Dynamic Categories:",
        categoryNames
    );


    // =============================================
    // CATEGORY ICONS
    // =============================================

    const categoryIcons = {

        "Perfumes": "bi-flower1",

        "Flowers": "bi-stars",

        "Chocolate": "bi-gift",

        "Bags": "bi-handbag",

        "Clothes": "bi-person-standing",

        "Food": "bi-egg-fried",

        "Gifts": "bi-gift"

    };


    // =============================================
    // CREATE CATEGORY CARDS
    // =============================================

    categoryNames.forEach(function (category) {

        const card =
            document.createElement("div");


        card.className =
            "category-card";


        // Get icon for category
        // If category does not exist in
        // categoryIcons, use default icon

        const icon =
            categoryIcons[category] ||
            "bi-grid";


        card.innerHTML = `

            <i class="bi ${icon}"></i>

            <p>
                ${category}
            </p>

        `;


        // =========================================
        // CATEGORY CLICK
        // =========================================

        card.addEventListener(
            "click",
            function () {

                console.log(
                    "Selected category:",
                    category
                );


                // Send category name
                // to Products page

                window.location.href =
                    "Products.html?category=" +
                    encodeURIComponent(category);

            }
        );


        container.appendChild(card);

    });


    // =============================================
    // NO CATEGORIES
    // =============================================

    if (categoryNames.length === 0) {

        container.innerHTML = `

            <div class="home-empty">

                No categories found.

            </div>

        `;

    }

}

















// =====================================================
// MAKE FUNCTION AVAILABLE
// =====================================================

window.loadHomeProducts =
    loadHomeProducts;

