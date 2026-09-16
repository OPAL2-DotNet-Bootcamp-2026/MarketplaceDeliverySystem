// Check if the customer is logged in
const currentPage = window.location.pathname.toLowerCase();

const customerPages = [
    "businesses.html",
    "products.html",
    "orderhistory.html",
    "trackorder.html",
    "driverinfo.html"
];

const requiresLogin = customerPages.some(page =>
    currentPage.includes(page)
);

const authToken = localStorage.getItem("authToken");

if (requiresLogin && !authToken) {

    alert("Please login first.");

    window.location.href = "Login.html";
}


// Load the header
// JavaScript goes to header.html
// It reads all the HTML inside that file
// It finds: <div id="header-container"></div>
// It puts the contents of header.html inside it.
// this hides the navigation visually on the Delivered Status page
fetch("../sharedComponents/header.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("header-container").innerHTML = data;

        if (currentPage.includes("deliveredstatus.html")) {

            const navigation = document.querySelector(".navigation");

            if (navigation) {
                navigation.style.display = "none";
            }
        }
    });


// Load the sidebar
fetch("../sharedComponents/sidebar.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("sidebar-container").innerHTML = data;

        if (currentPage.includes("deliveredstatus.html")) {

            // Change Shopper information to Driver
            const userTitle = document.querySelector(".user-info h3");
            const userRole = document.querySelector(".user-info span");

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

                const text = item.textContent.trim();

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

        initializeSidebar();
    });


// Sidebar functionality
function initializeSidebar() {

    const sidebar = document.getElementById("category-sidebar");

    const closeButton = document.getElementById("close-sidebar");
    // This finds the HTML element with:<div id="sidebar-overlay"></div>
    // overlay covers the page when the sidebar opens
    // Find the HTML element whose ID is sidebar-overlay and store it in the variable overlay
    const overlay = document.getElementById("sidebar-overlay");
    // This finds:<div class="categories"></div>
    //querySelector with classes(.categories is a class)
    const categories = document.getElementById("menu-button");


    const logoutButton = document.getElementById("logoutButton");


    // Open sidebar
    //classList allows JavaScript to manage css classes into html.
    //When the user clicks the Categories area, run this code.
    categories.addEventListener("click", function () {
        // sidebar gets the class: open
        //It adds the class open to the overlay and sidebar
        sidebar.classList.add("open");
        // This creates the dark background behind the sidebar.
        //CSS detects: #sidebar-overlay.open
        overlay.classList.add("open");

    });


    // Close sidebar
    //When the user clicks the dark area outside the sidebar, close it.
    //the user has two ways to close the sidebar:
    //1. Click ✕
    //2. Click outside the sidebar
    closeButton.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });


    // Close when clicking outside
    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });

    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userFullName');

        window.location.href = '../html pages/home.html';
    });

}