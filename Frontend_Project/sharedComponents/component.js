
// Go and get footer.html
fetch("../sharedComponents/footer.html")
    .then(response => response.text())  //Read the HTML inside that file as text.
    .then(data => {
        // document.getElementById("footer-container") will find <div id="footer-container"></div>
        document.getElementById("footer-container").innerHTML = data;
        // .innerHTML: Put the footer HTML inside that container.
        //document. represents the entire HTML of the webpage
    });

    