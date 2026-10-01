interface HomeCategory {
    categoryId: number;
    categoryName: string;
    categoryNameEn?: string;
}

interface PopularBusiness {
    businessId: number;
    businessName: string;
    businessCategoryName?: string | null;
    logoUrl?: string | null;
    address?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    isOpen: boolean;
    orderCount: number;
}

const API_BASE_URL = "https://localhost:7299";
const HOME_CATEGORIES_API = `${API_BASE_URL}/api/BusinessCategory/GetHomeCategories`;
const POPULAR_BUSINESSES_API = `${API_BASE_URL}/api/Business/GetPopularBusinesses?limit=4`;
const LOGO_PLACEHOLDER = "../assets/img/LogoPlaceHolder.png";

document.addEventListener("DOMContentLoaded", () => {
    void loadCategories();
    void loadPopularBusinesses();

    const authButton = document.getElementById("authButton");
    if (authButton && localStorage.getItem("authToken")) {
        authButton.style.display = "none";
    }
});

async function getItems<T>(url: string, isItem: (value: unknown) => value is T): Promise<T[]> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Expected an array from the API");
    return data.filter(isItem);
}

function showMessage(container: HTMLElement, message: string): void {
    const paragraph = document.createElement("p");
    paragraph.className = "home-section-message";
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
}

async function loadCategories(): Promise<void> {
    const container = document.getElementById("categories-container");
    if (!container) return;
    showMessage(container, "Loading categories...");

    try {
        const categories = await getItems(HOME_CATEGORIES_API, isHomeCategory);
        const seen = new Set<string>();
        const uniqueCategories = categories.filter(category => {
            const key = String(category.categoryId);
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (uniqueCategories.length === 0) {
            showMessage(container, "No business categories available.");
            return;
        }

        const fragment = document.createDocumentFragment();
        uniqueCategories.forEach(category => {
            const card = document.createElement("a");
            card.className = "category-card";
            card.href = `Businesses.html?categoryId=${encodeURIComponent(category.categoryId)}`;

            const icon = document.createElement("i");
            icon.className = categoryIcon(category.categoryNameEn || category.categoryName);
            icon.setAttribute("aria-hidden", "true");

            const name = document.createElement("p");
            name.textContent = category.categoryName;
            card.append(icon, name);
            fragment.append(card);
        });
        container.replaceChildren(fragment);
    } catch (error) {
        console.error("Home categories could not be loaded:", error);
        showMessage(container, "Business categories could not be loaded. Make sure the API is running.");
    }
}

async function loadPopularBusinesses(): Promise<void> {
    const container = document.getElementById("popular-businesses-container");
    if (!container) return;
    showMessage(container, "Loading businesses...");

    try {
        const businesses = await getItems(POPULAR_BUSINESSES_API, isPopularBusiness);
        if (businesses.length === 0) {
            showMessage(container, "No businesses available.");
            return;
        }

        const fragment = document.createDocumentFragment();
        businesses.forEach(business => fragment.append(createBusinessCard(business)));
        container.replaceChildren(fragment);
    } catch (error) {
        console.error("Popular businesses could not be loaded:", error);
        showMessage(container, "Popular businesses could not be loaded. Make sure the API is running.");
    }
}

function createBusinessCard(business: PopularBusiness): HTMLAnchorElement {
    const card = document.createElement("a");
    card.className = "popular-business-card";
    card.href = `Products.html?businessId=${encodeURIComponent(business.businessId)}`;

    const logoWrap = document.createElement("div");
    logoWrap.className = "popular-business-logo-wrap";
    const logo = document.createElement("img");
    logo.className = "popular-business-logo";
    logo.src = logoUrl(business.logoUrl);
    logo.alt = business.businessName;
    logo.addEventListener("error", () => {
        logo.src = LOGO_PLACEHOLDER;
    }, { once: true });
    logoWrap.append(logo);

    const info = document.createElement("div");
    info.className = "popular-business-info";
    const meta = document.createElement("div");
    meta.className = "popular-business-meta";
    const category = document.createElement("span");
    category.className = "business-category";
    category.textContent = business.businessCategoryName || "Local Business";
    const status = document.createElement("span");
    status.className = `business-status${business.isOpen ? " open" : ""}`;
    status.textContent = business.isOpen ? "Open" : "Closed";
    meta.append(category, status);

    const name = document.createElement("h3");
    name.textContent = business.businessName;
    const address = document.createElement("p");
    address.className = "business-address";
    address.textContent = business.address || "Marketplace business";

    const footer = document.createElement("div");
    footer.className = "business-card-footer";
    const hours = document.createElement("span");
    hours.textContent = business.openingTime && business.closingTime
        ? `${formatTime(business.openingTime)} - ${formatTime(business.closingTime)}`
        : "Hours unavailable";
    const orders = document.createElement("span");
    orders.textContent = business.orderCount < 1
        ? "New business"
        : `${business.orderCount} ${business.orderCount === 1 ? "order" : "orders"}`;
    footer.append(hours, orders);
    info.append(meta, name, address, footer);

    const arrow = document.createElement("i");
    arrow.className = "bi bi-arrow-right business-card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    card.append(logoWrap, info, arrow);
    return card;
}

function logoUrl(value?: string | null): string {
    if (!value) return LOGO_PLACEHOLDER;
    return /^(https?:|data:|\/)/i.test(value) ? value : `../assets/img/${value}`;
}

function formatTime(value: string): string {
    const [hoursValue, minutes = "00"] = value.split(":");
    const hours = Number(hoursValue);
    if (Number.isNaN(hours)) return value;
    return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
}

function categoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes("perfume") || name.includes("oud")) return "bi bi-stars";
    if (name.includes("flower")) return "bi bi-flower1";
    if (name.includes("chocolate") || name.includes("sweet")) return "bi bi-gift";
    if (name.includes("food") || name.includes("kitchen") || name.includes("bakery")) return "bi bi-egg-fried";
    if (name.includes("fashion")) return "bi bi-handbag";
    if (name.includes("decor") || name.includes("craft")) return "bi bi-palette";
    return "bi bi-grid";
}

function isHomeCategory(value: unknown): value is HomeCategory {
    if (typeof value !== "object" || value === null) return false;
    const category = value as Record<string, unknown>;
    return typeof category.categoryId === "number" && typeof category.categoryName === "string";
}

function isPopularBusiness(value: unknown): value is PopularBusiness {
    if (typeof value !== "object" || value === null) return false;
    const business = value as Record<string, unknown>;
    return typeof business.businessId === "number"
        && typeof business.businessName === "string"
        && typeof business.isOpen === "boolean"
        && typeof business.orderCount === "number";
}

export {};
