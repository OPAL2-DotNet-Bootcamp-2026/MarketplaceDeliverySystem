
// Go and get footer.html
fetch("../sharedComponents/footer.html")
    .then(response => response.text())  //Read the HTML inside that file as text.
    .then(data => {
        // document.getElementById("footer-container") will find <div id="footer-container"></div>
        document.getElementById("footer-container").innerHTML = data;
        // .innerHTML: Put the footer HTML inside that container.
        //document. represents the entire HTML of the webpage
    });
/* =========================
   FLOATING NAVIGATION
   ========================= */

window.addEventListener("scroll", function () {

    const floatingNavigation =
        document.getElementById("floating-navigation");

    const mainHeader =
        document.querySelector(".header");

    if (!floatingNavigation || !mainHeader) {
        return;
    }

    if (window.scrollY > 100) {

        // Hide the original header
        mainHeader.classList.add("scrolled");

        // Show the compact header
        floatingNavigation.classList.add("show");

    } else {

        // Show the original header
        mainHeader.classList.remove("scrolled");

        // Hide the compact header
        floatingNavigation.classList.remove("show");
    }

});
    