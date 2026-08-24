// Base API configuration (adjust port if different)
const API_URL = "http://localhost:7299/api/Business/GetAllBusinesses";

document.addEventListener("DOMContentLoaded", () => {
    loadBusinesses();
});

async function loadBusinesses() {
    const listContainer = document.querySelector("#businesses-list");
    const vendorCountBadge = document.querySelector("#vendor-count-badge");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch businesses: ${response.status} ${response.statusText}`);
        }

        // Parse JSON response matching BusinessCardRespDTO
        const businesses = await response.json();

        // 1. Update vendor total badge
        if (vendorCountBadge) {
            vendorCountBadge.textContent = `${businesses.length} Vendors`;
        }

        // 2. Clear placeholder content
        listContainer.innerHTML = "";

        if (businesses.length === 0) {
            listContainer.innerHTML = `<p class="text-muted p-3">No registered businesses found.</p>`;
            return;
        }

        // 3. Render business cards
        businesses.forEach(business => {
            const formattedHours = formatTimeOnlyRange(business.openingTime, business.closingTime);
            const logo = business.logoUrl || "/assets/img/UmShakir logo-01.jpg";

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

    } catch (error) {
        console.error("Error loading businesses:", error);
        listContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Unable to load businesses at this time. Please check your connection or backend server.
            </div>
        `;
    }
}

// Converts TimeOnly string ("09:00:00" or "22:00:00") into "9:00 AM - 10:00 PM"
function formatTimeOnlyRange(openingStr, closingStr) {
    if (!openingStr || !closingStr) return "Closed";

    const formatSingleTime = (timeStr) => {
        const parts = timeStr.split(":");
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || "00";
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 becomes 12

        return `${hours}:${minutes} ${ampm}`;
    };

    return `${formatSingleTime(openingStr)} - ${formatSingleTime(closingStr)}`;
}