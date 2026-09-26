// ============================================
// HOME PAGE - TypeScript
// ============================================


// ============================================
// INTERFACES
// ============================================

interface Category {
    categoryId: number;
    categoryName: string;
}


interface Product {
    productId: number;
    productName: string;
    imageUrl?: string | null;
    averageRating?: number | null;
    price?: number | null;
}


// ============================================
// API URLs
// ============================================

const CATEGORIES_API: string =
    "https://localhost:7299/api/Category/GetSidebarCategories";


const PRODUCTS_API: string =
    "https://localhost:7299/api/Product/business";


// ============================================
// BUSINESS ID
// ============================================

// The products in our database belong to BusinessId = 1

const BUSINESS_ID: number = 1;


// ============================================
// WHEN PAGE IS LOADED
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    (): void => {

        // Load Categories
        loadCategories();

        // Load Popular Products
        loadProducts();

        // Hide Login / Sign Up when logged in
        hideAuthButtonIfLoggedIn();

    }
);

// ============================================
// HIDE LOGIN BUTTON WHEN LOGGED IN
// ============================================

function hideAuthButtonIfLoggedIn(): void {

    const authButton:
        HTMLElement | null =
        document.getElementById(
            "authButton"
        );


    const token:
        string | null =
        localStorage.getItem(
            "authToken"
        );


    // ========================================
    // Hide only if the button exists
    // and the customer is logged in
    // ========================================

    if (authButton && token) {

        authButton.style.display = "none";
    }
}

// ============================================
// LOAD CATEGORIES
// ============================================

async function loadCategories(): Promise<void> {

    const container:
        HTMLElement | null =
        document.getElementById(
            "categories-container"
        );


    // ========================================
    // Make sure container exists
    // ========================================

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

        const response:
            Response =
            await fetch(
                CATEGORIES_API
            );


        // ========================================
        // Check response
        // ========================================

        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );
        }


        // ========================================
        // Convert response to JSON
        // ========================================

        const data:
            unknown =
            await response.json();


        // ========================================
        // Make sure JSON is an array
        // ========================================

        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid categories data"
            );
        }


        // ========================================
        // Convert to Category[]
        // ========================================

        const categories:
            Category[] =
            data.filter(
                isCategory
            );


        // ========================================
        // Remove duplicate categories
        // ========================================

        const uniqueCategories:
            Category[] = [];


        const categoryNames:
            Set<string> =
            new Set<string>();


        categories.forEach(
            (
                category: Category
            ): void => {

                // Get category name

                const name:
                    string =
                    category.categoryName.trim();


                // Ignore empty names

                if (!name) {

                    return;
                }


                // Convert to lowercase
                // Perfumes and perfumes
                // are considered the same

                const key:
                    string =
                    name.toLowerCase();


                // Add only if not already added

                if (
                    !categoryNames.has(key)
                ) {

                    categoryNames.add(key);

                    uniqueCategories.push(
                        category
                    );
                }

            }
        );


        // ========================================
        // Show ONLY first 3 categories
        // ========================================

        const displayedCategories:
            Category[] =
            uniqueCategories.slice(
                0,
                3
            );


        // ========================================
        // Clear container
        // ========================================

        container.innerHTML = "";


        // ========================================
        // Check if there are no categories
        // ========================================

        if (
            displayedCategories.length === 0
        ) {

            container.innerHTML = `
                <p>No categories available.</p>
            `;

            return;
        }


        // ========================================
        // Create category cards
        // ========================================

        displayedCategories.forEach(
            (
                category: Category
            ): void => {

                // Get icon

                const icon:
                    string =
                    getCategoryIcon(
                        category.categoryName
                    );


                // Create category card

                const categoryCard:
                    string = `

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


                // Add card to container

                container.insertAdjacentHTML(
                    "beforeend",
                    categoryCard
                );

            }
        );

    }

    catch (error: unknown) {

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

function openCategory(
    categoryId: number
): void {

    window.location.href =
        `Products.html?businessId=${BUSINESS_ID}&categoryId=${categoryId}`;
}


// ============================================
// CATEGORY ICONS
// ============================================

function getCategoryIcon(
    categoryName: string
): string {

    const name:
        string =
        categoryName.toLowerCase();


    // ========================================
    // Perfumes
    // ========================================

    if (
        name.includes("perfume")
    ) {

        return "bi bi-stars";
    }


    // ========================================
    // Flowers
    // ========================================

    if (
        name.includes("flower")
    ) {

        return "bi bi-flower1";
    }


    // ========================================
    // Chocolate
    // ========================================

    if (
        name.includes("chocolate")
    ) {

        return "bi bi-gift";
    }


    // ========================================
    // Food
    // ========================================

    if (
        name.includes("food")
    ) {

        return "bi bi-egg-fried";
    }


    // ========================================
    // Fashion
    // ========================================

    if (
        name.includes("fashion")
    ) {

        return "bi bi-handbag";
    }


    // ========================================
    // Decor
    // ========================================

    if (
        name.includes("decor")
    ) {

        return "bi bi-palette";
    }


    // ========================================
    // Default
    // ========================================

    return "bi bi-grid";
}


// ============================================
// LOAD PRODUCTS
// ============================================

async function loadProducts(): Promise<void> {

    const container:
        HTMLElement | null =
        document.getElementById(
            "products-container"
        );


    // ========================================
    // Make sure container exists
    // ========================================

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

        const url:
            string =
            `${PRODUCTS_API}/${BUSINESS_ID}`;


        // ========================================
        // Send GET request
        // ========================================

        const response:
            Response =
            await fetch(
                url
            );


        // ========================================
        // Check response
        // ========================================

        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );
        }


        // ========================================
        // Convert response to JSON
        // ========================================

        const data:
            unknown =
            await response.json();


        // ========================================
        // Make sure JSON is an array
        // ========================================

        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid products data"
            );
        }


        // ========================================
        // Convert to Product[]
        // ========================================

        const products:
            Product[] =
            data.filter(
                isProduct
            );


        // ========================================
        // Remove duplicate products
        // ========================================

        const uniqueProducts:
            Product[] = [];


        const productIds:
            Set<number> =
            new Set<number>();


        products.forEach(
            (
                product: Product
            ): void => {

                // Get product ID

                const productId:
                    number =
                    product.productId;


                // Ignore products without ID

                if (!productId) {

                    return;
                }


                // Add only unique products

                if (
                    !productIds.has(productId)
                ) {

                    productIds.add(
                        productId
                    );

                    uniqueProducts.push(
                        product
                    );
                }

            }
        );


        // ========================================
        // Show ONLY first 3 products
        // ========================================

        const displayedProducts:
            Product[] =
            uniqueProducts.slice(
                0,
                3
            );


        // ========================================
        // Clear container
        // ========================================

        container.innerHTML = "";


        // ========================================
        // Check if there are no products
        // ========================================

        if (
            displayedProducts.length === 0
        ) {

            container.innerHTML = `
                <p>No products available.</p>
            `;

            return;
        }


        // ========================================
        // Create product cards
        // ========================================

        displayedProducts.forEach(
            (
                product: Product
            ): void => {

                createProductCard(
                    product,
                    container
                );

            }
        );

    }

    catch (error: unknown) {

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
    product: Product,
    container: HTMLElement
): void {

    // ========================================
    // Product Image
    // ========================================

    let imageUrl:
        string =
        "../assets/img/ProductPlaceHolder.png";


    if (
        product.imageUrl
    ) {

        imageUrl =
            "../assets/img/" +
            product.imageUrl;
    }


    // ========================================
    // Product Rating
    // ========================================

    const rating:
        string =
        Number(
            product.averageRating || 0
        ).toFixed(1);


    // ========================================
    // Product Price
    // ========================================

    const price:
        string =
        Number(
            product.price || 0
        ).toFixed(3);


    // ========================================
    // Create Product Card
    // ========================================

    const productCard:
        string = `

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

function toggleFavorite(
    heart: HTMLElement
): void {

    // ========================================
    // Empty heart → Filled heart
    // ========================================

    if (
        heart.classList.contains(
            "bi-heart"
        )
    ) {

        heart.classList.remove(
            "bi-heart"
        );

        heart.classList.add(
            "bi-heart-fill"
        );
    }


    // ========================================
    // Filled heart → Empty heart
    // ========================================

    else {

        heart.classList.remove(
            "bi-heart-fill"
        );

        heart.classList.add(
            "bi-heart"
        );
    }
}


// ============================================
// CATEGORY TYPE GUARD
// ============================================

function isCategory(
    value: unknown
): value is Category {

    // Make sure value is an object

    if (
        typeof value !== "object" ||
        value === null
    ) {

        return false;
    }


    const category:
        Record<string, unknown> =
        value as Record<string, unknown>;


    return (
        typeof category.categoryId === "number" &&
        typeof category.categoryName === "string"
    );
}


// ============================================
// PRODUCT TYPE GUARD
// ============================================

function isProduct(
    value: unknown
): value is Product {

    // Make sure value is an object

    if (
        typeof value !== "object" ||
        value === null
    ) {

        return false;
    }


    const product:
        Record<string, unknown> =
        value as Record<string, unknown>;


    return (
        typeof product.productId === "number" &&
        typeof product.productName === "string"
    );
}


// ============================================
// GLOBAL WINDOW FUNCTIONS
// ============================================
//
// Because Home.ts is a module,
// functions are not automatically global.
//
// Our HTML uses:
//
// onclick="openCategory(...)"
//
// and:
//
// onclick="toggleFavorite(this)"
//
// Therefore we add them to Window.
// ============================================

declare global {

    interface Window {

        openCategory: (
            categoryId: number
        ) => void;

        toggleFavorite: (
            heart: HTMLElement
        ) => void;
    }
}


// ============================================
// CONNECT FUNCTIONS TO WINDOW
// ============================================

window.openCategory =
    openCategory;


window.toggleFavorite =
    toggleFavorite;


// ============================================
// MODULE
// ============================================

export {};