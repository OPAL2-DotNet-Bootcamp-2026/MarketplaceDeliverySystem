// 1. Find which page the user is on
// 2. Check if login is required
// 3. Load the header and sidebar
// 4. Make the sidebar buttons work

// ============================================
// CURRENT PAGE
// ============================================

const currentPagePath = window.location.pathname.toLowerCase();


// ============================================
// LOGIN CHECK
// ============================================

const customerPages = [
    "businesses.html",
    "products.html",
    "orderhistory.html",
    "trackorder.html",
    "driverinfo.html"
];

const requiresLogin = customerPages.some(page =>
    currentPagePath.includes(page)
);

const authToken = localStorage.getItem("authToken");

if (requiresLogin && !authToken) {

    alert("Please login first.");

    window.location.href = "Login.html";
}


// ============================================
// LOAD HEADER AND SIDEBAR
// ============================================

Promise.all([

    fetch("../sharedComponents/header.html")
        .then(response => response.text()),

    fetch("../sharedComponents/sidebar.html")
        .then(response => response.text())

])
.then(([headerData, sidebarData]) => {

    // Load header
    const headerContainer =
        document.getElementById("header-container");

    if (headerContainer) {
        headerContainer.innerHTML = headerData;
    }


    // Load sidebar
    const sidebarContainer =
        document.getElementById("sidebar-container");

    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebarData;
    }


    // ========================================
    // DELIVERED STATUS PAGE
    // ========================================

    if (currentPagePath.includes("deliveredstatus.html")) {

        // Hide customer navigation
        const navigation =
            document.querySelector(".navigation");

        if (navigation) {
            navigation.style.display = "none";
        }


        // Change Shopper information to Driver
        const userTitle =
            document.querySelector(".user-info h3");

        const userRole =
            document.querySelector(".user-info span");

        if (userTitle) {
            userTitle.textContent = "Hi, Driver!";
        }

        if (userRole) {
            userRole.textContent = "DRIVER";
        }


        // Remove customer-only menu items
        const sidebarItems =
            document.querySelectorAll(".sidebar-item");

        sidebarItems.forEach(item => {

            const text =
                item.textContent.trim();

            if (
                text.includes("Home") ||
                text.includes("Browse Products") ||
                text.includes("My Orders") ||
                text.includes("Track Delivery") ||
                text.includes("Favorites")
            ) {
                item.remove();
            }

        });


        // Remove customer promotional card
        const promoCard =
            document.querySelector(".sidebar-promo");

        if (promoCard) {
            promoCard.remove();
        }
    }


    // ========================================
    // INITIALIZE SIDEBAR
    // ========================================

    initializeSidebar();

});


// ============================================
// SIDEBAR FUNCTIONALITY
// ============================================

function initializeSidebar() {

    const sidebar =
        document.getElementById("category-sidebar");

    const closeButton =
        document.getElementById("close-sidebar");

    const overlay =
        document.getElementById("sidebar-overlay");

    const categories =
        document.getElementById("menu-button");

    const logoutButton =
        document.getElementById("logoutButton");


    // Make sure all required elements exist
    if (
        !sidebar ||
        !closeButton ||
        !overlay ||
        !categories ||
        !logoutButton
    ) {
        console.error("Sidebar elements were not found.");
        return;
    }


    // ========================================
    // OPEN SIDEBAR
    // ========================================

    categories.addEventListener("click", function () {

        sidebar.classList.add("open");

        overlay.classList.add("open");

    });


    // ========================================
    // CLOSE SIDEBAR
    // ========================================

    closeButton.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });


    // ========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================

    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });


    // ========================================
    // LOGOUT
    // ========================================

    logoutButton.addEventListener("click", function (event) {

        event.preventDefault();

        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userFullName");

        window.location.href =
            "../html pages/home.html";

    });

}