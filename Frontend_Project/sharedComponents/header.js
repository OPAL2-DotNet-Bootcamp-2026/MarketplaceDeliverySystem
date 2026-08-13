// Load the header
fetch("../sharedComponents/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header-container").innerHTML = data;
    });


// Load the sidebar
fetch("../sharedComponents/sidebar.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("sidebar-container").innerHTML = data;

        initializeSidebar();
    });


// Sidebar functionality
function initializeSidebar() {

    const sidebar = document.getElementById("category-sidebar");

    const closeButton = document.getElementById("close-sidebar");

    const overlay = document.getElementById("sidebar-overlay");

    const categories = document.querySelector(".categories");


    // Open sidebar
    categories.addEventListener("click", function () {

        sidebar.classList.add("open");

        overlay.classList.add("open");

    });


    // Close sidebar
    closeButton.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });


    // Close when clicking outside
    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("open");

    });

}