// 1. Find which page the user is on
// 2. Check if login is required
// 3. Load the header and sidebar
// 4. Make the sidebar buttons work

// ============================================
// CURRENT PAGE
// ============================================

//This gets the current page path from the browser like "/html pages/Products.html" and converts it to lowercase.
const currentPagePath = window.location.pathname.toLowerCase();


// ============================================
// LOGIN CHECK
// ============================================
//List the pages that require login
const customerPages = [
    "businesses.html",
    "products.html",
    "orderhistory.html",
    "trackorder.html",
    "driverinfo.html"
];

//Check whether the current page is one of the customerPages
// if yes, then requiresLogin will be true. If not, it will be false.
const requiresLogin = customerPages.some(page =>
    currentPagePath.includes(page)
);

//Get the login token
const authToken = localStorage.getItem("authToken");

if (requiresLogin && !authToken) {

    alert("Please login first.");
    //Send user to Login page
    window.location.href = "Login.html";
}


// ============================================
// LOAD HEADER AND SIDEBAR
// ============================================

//This is used because we need to load two files: header.html and sidebar.html
//promise: means I will give you the result later
Promise.all([
    //asks the browser to get the files
    //response.text(): means read the HTML inside that file as text.
    fetch("../sharedComponents/header.html")
        .then(response => response.text()),

    fetch("../sharedComponents/sidebar.html")
        .then(response => response.text())

])
    //This runs after both requests are finished
    //headerData  → contents of header.html
    //sidebarData → contents of sidebar.html
    .then(([headerData, sidebarData]) => {

        // Load header into the header container of the current page
        //Find the header container: <div id="header-container"></div>
        const headerContainer =
            document.getElementById("header-container");

        if (headerContainer) {
            headerContainer.innerHTML = headerData;
        }


        // Load sidebar into the sidebar container of the current page
        const sidebarContainer =
            document.getElementById("sidebar-container");

        if (sidebarContainer) {
            sidebarContainer.innerHTML = sidebarData;
        }


        // ========================================
        // DELIVERED STATUS PAGE
        // ========================================

        //Am I currently on the DeliveredStatus page?
        //If yes, the code does some special changes for the driver.
        if (currentPagePath.includes("deliveredstatus.html")) {

            // Hide customer navigation
            const navigation =
                document.querySelector(".navigation");
            //JavaScript changes its CSS to --> display: none;
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
                // Get the text content of the sidebar item and trim whitespace
                const text =
                    item.textContent.trim();

                if (
                    text.includes("Home") ||
                    text.includes("Browse Products") ||
                    text.includes("My Orders") ||
                    text.includes("Track Delivery") ||
                    text.includes("Favorites")
                ) {
                    // Remove the item from the sidebar if it matches any of the customer-only items
                    item.remove();
                }

            });


            // Remove customer promotional card: 
            // Ready to Shop?
            // Discover amazing products...
            // Shop Now
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
//make the sidebar interactive.
function initializeSidebar() {
    //Find the sidebar
    const sidebar =
        document.getElementById("category-sidebar");
    //Find the close button x 
    const closeButton =
        document.getElementById("close-sidebar");

    //Find the overlay that covers the rest of the page when sidebar is open
    const overlay =
        document.getElementById("sidebar-overlay");

    //Find the categories button in the header that opens the sidebar
    const categories =
        document.getElementById("menu-button");

    //Find the logout button in the sidebar
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

    //When the user clicks the categories button, open the sidebar and show the overlay
    categories.addEventListener("click", function () {

        //The open class is then used by your CSS to show the sidebar and overlay.
        // Click ☰ --> Add "open" --> Sidebar appears
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
        //stops the normal behavior of the <a> 
        //Don't do the normal link action. I want my JavaScript to handle it instead.
        event.preventDefault();
        
        //removes the login token
        localStorage.removeItem("authToken");
        //removes the user role and full name from localStorage
        localStorage.removeItem("userRole");
        localStorage.removeItem("userFullName");

        window.location.href =
            "../html pages/home.html";

    });

}