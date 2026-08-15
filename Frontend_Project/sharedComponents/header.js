// Load the header
// JavaScript goes to header.html
// It reads all the HTML inside that file
// It finds: <div id="header-container"></div>
// It puts the contents of header.html inside it.
//
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
    // This finds the HTML element with:<div id="sidebar-overlay"></div>
    //overlay covers the page when the sidebar opens
    const overlay = document.getElementById("sidebar-overlay");
    // This finds:<div class="categories"></div>
    const categories = document.querySelector(".categories");


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

}