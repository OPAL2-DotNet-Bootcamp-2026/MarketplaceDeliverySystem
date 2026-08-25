const BASE_API_URL = "https://localhost:7299/api/Business/GetAllBusinesses";
const CATEGORIES_API_URL = "https://localhost:7299/api/Category/GetSidebarCategories";

let allBusinesses = [];
let currentPage = 1;
const itemsPerPage = 3;
let selectedCategoryId = null;

document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
    await loadBusinesses();
});

async function loadCategories() {
    const categoryContainer = document.querySelector("#category-filter-list");
    if (!categoryContainer) return;

    try {
        const response = await fetch(CATEGORIES_API_URL);
        if (!response.ok) throw new Error("Failed to load categories");

        const categories = await response.json();

        // 1. "All Businesses" tab (No count badge)
        let html = `
            <a href="#" data-category-id=""
                class="list-group-item list-group-item-action category-item brand-active d-flex align-items-center">
                <span><span class="me-2">🏪</span> All Businesses</span>
            </a>
        `;

        // 2. Dynamic Categories (No count badge)
        categories.forEach(cat => {
            html += `
                <a href="#" data-category-id="${cat.categoryId}"
                    class="list-group-item list-group-item-action category-item d-flex align-items-center">
                    <span><span class="me-2">📦</span> ${cat.categoryName}</span>
                </a>
            `;
        });

        categoryContainer.innerHTML = html;

        // 3. Attach category filter click events
        const categoryLinks = categoryContainer.querySelectorAll(".category-item");
        categoryLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove("brand-active"));
                link.classList.add("brand-active");

                const catId = link.getAttribute("data-category-id");
                selectedCategoryId = catId ? parseInt(catId, 10) : null;

                loadBusinesses(selectedCategoryId);
            });
        });

    } catch (err) {
        console.error("Error loading categories:", err);
        categoryContainer.innerHTML = `<p class="text-danger small p-2">Failed to load categories.</p>`;
    }
}

async function loadBusinesses(categoryId = null) {
    const listContainer = document.querySelector("#businesses-list");
    const paginationList = document.querySelector("#pagination-list");

    listContainer.innerHTML = `
        <div class="text-center py-4 text-muted">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading businesses...
        </div>
    `;

    try {
        let url = BASE_API_URL;
        if (categoryId) {
            url += `?categoryId=${categoryId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allBusinesses = await response.json();

        if (allBusinesses.length === 0) {
            listContainer.innerHTML = `<p class="text-muted p-3">No registered businesses found in this category.</p>`;
            if (paginationList) paginationList.innerHTML = "";
            return;
        }

        currentPage = 1;
        renderCurrentPage();

    } catch (error) {
        console.error("Error loading businesses:", error);
        listContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Unable to load businesses at this time. Please check your connection or server.
            </div>
        `;
        if (paginationList) paginationList.innerHTML = "";
    }
}

function renderCurrentPage() {
    const listContainer = document.querySelector("#businesses-list");
    listContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allBusinesses.slice(startIndex, endIndex);

    pageItems.forEach(business => {
        const formattedHours = formatTimeOnlyRange(business.openingTime, business.closingTime);
        const logo = business.logoUrl || "/assets/img/LogoPlaceHolder.PNG";

        const cardHtml = `
            <div class="card business-horizontal-card shadow-sm">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${logo}" 
                             class="business-card-img flex-shrink-0" 
                             alt="${business.businessName} Logo">
                        <div class="d-flex flex-column justify-content-center">
                            <h5 class="card-title mb-1">
                                <a href="/html pages/Products.html?businessId=${business.businessId}" 
                                   class="text-decoration-none stretched-link">
                                    ${business.businessName}
                                </a>
                            </h5>
                            <div class="d-flex align-items-center mt-1">
                                <span class="badge ${business.isOpen ? 'badge-status-open' : 'badge-status-closed'} small">
                                    🕒 ${formattedHours}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        listContainer.insertAdjacentHTML("beforeend", cardHtml);
    });

    renderPaginationControls();
}

function renderPaginationControls() {
    const paginationList = document.querySelector("#pagination-list");
    if (!paginationList) return;

    paginationList.innerHTML = "";
    const totalPages = Math.ceil(allBusinesses.length / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous Button
    const isPrevDisabled = currentPage === 1;
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${isPrevDisabled ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    if (!isPrevDisabled) {
        prevLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage--;
            renderCurrentPage();
        });
    }
    paginationList.appendChild(prevLi);

    // Number Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement("li");
        const isActive = i === currentPage;
        pageLi.className = `page-item ${isActive ? "active" : ""}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;

        pageLi.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPage !== i) {
                currentPage = i;
                renderCurrentPage();
            }
        });

        paginationList.appendChild(pageLi);
    }

    // Next Button
    const isNextDisabled = currentPage === totalPages;
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${isNextDisabled ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    if (!isNextDisabled) {
        nextLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage++;
            renderCurrentPage();
        });
    }
    paginationList.appendChild(nextLi);
}

function formatTimeOnlyRange(openingStr, closingStr) {
    if (!openingStr || !closingStr) return "Closed";

    const formatSingleTime = (timeStr) => {
        const parts = timeStr.split(":");
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || "00";
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${hours}:${minutes} ${ampm}`;
    };

    return `${formatSingleTime(openingStr)} - ${formatSingleTime(closingStr)}`;
}