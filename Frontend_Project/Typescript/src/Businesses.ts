interface Business {
  businessId: number;
  businessName: string;
  logoUrl?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen: boolean;
}

interface BusinessCategory {
  categoryId: number;
  categoryName: string;
}

(() => {
  const BASE_API_URL =
    "https://localhost:7299/api/Business/GetAllBusinesses";

  const CATEGORIES_API_URL =
    "https://localhost:7299/api/BusinessCategory/GetSidebarCategories";

  let allBusinesses: Business[] = [];
  let currentPage: number = 1;
  const itemsPerPage: number = 3;
  let selectedCategoryId: number | null = null;

  document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
    await loadCategories();
    await loadBusinesses();
  });

  async function loadCategories(): Promise<void> {
    const categoryContainer =
      document.querySelector<HTMLElement>("#category-filter-list");

    if (!categoryContainer) return;

    function getCategoryEmoji(categoryName: string | undefined): string {
      if (!categoryName) return "🛍️";

      const name = categoryName.toLowerCase();

      if (name.includes("restaurant")) return "🍽️";

      if (
        name.includes("traditional") ||
        name.includes("home kitchen") ||
        name.includes("kitchen")
      ) {
        return "🥘";
      }

      if (
        name.includes("bakery") &&
        name.includes("sweet")
      ) {
        return "🧁";
      }

      if (
        name.includes("bakery") ||
        name.includes("dessert") ||
        name.includes("bread")
      ) {
        return "🥐";
      }

      if (
        name.includes("sweet") ||
        name.includes("cake")
      ) {
        return "🍰";
      }

      if (
        name.includes("perfume") ||
        name.includes("scent") ||
        name.includes("oud") ||
        name.includes("fragrance")
      ) {
        return "🪔";
      }

      if (
        name.includes("floral") ||
        name.includes("flower")
      ) {
        return "💐";
      }

      if (name.includes("gift")) return "🎁";

      if (
        name.includes("gourmet") ||
        name.includes("roaster") ||
        name.includes("treat") ||
        name.includes("nut")
      ) {
        return "🌰";
      }

      if (
        name.includes("coffee") ||
        name.includes("tea")
      ) {
        return "☕";
      }

      if (name.includes("chocolate")) return "🍫";

      return "🛍️";
    }

    try {
      const response: Response =
        await fetch(CATEGORIES_API_URL);

      if (!response.ok) {
        throw new Error("Failed to load categories");
      }

      const categories: BusinessCategory[] =
        await response.json();

      // All Businesses
      let html: string = `
                <a href="#"
                    data-category-id=""
                    class="list-group-item list-group-item-action category-item brand-active d-flex align-items-center">

                    <span class="category-emoji">🏪</span>

                    <span class="category-name">
                        All Businesses
                    </span>

                </a>
            `;

      // Dynamic Categories
      categories.forEach(
        (cat: BusinessCategory): void => {

          const emoji: string =
            getCategoryEmoji(cat.categoryName);

          html += `
                        <a href="#"
                            data-category-id="${cat.categoryId}"
                            class="list-group-item list-group-item-action category-item d-flex align-items-center">

                            <span class="category-emoji">
                                ${emoji}
                            </span>

                            <span class="category-name">
                                ${cat.categoryName}
                            </span>

                        </a>
                    `;
        }
      );

      categoryContainer.innerHTML = html;

      // Attach category click events
      const categoryLinks =
        categoryContainer.querySelectorAll<HTMLAnchorElement>(
          ".category-item"
        );

      categoryLinks.forEach(
        (link: HTMLAnchorElement): void => {

          link.addEventListener(
            "click",
            (e: MouseEvent): void => {

              e.preventDefault();

              categoryLinks.forEach(
                (l: HTMLAnchorElement): void => {
                  l.classList.remove("brand-active");
                }
              );

              link.classList.add("brand-active");

              const catId: string | null =
                link.getAttribute(
                  "data-category-id"
                );

              selectedCategoryId =
                catId
                  ? parseInt(catId, 10)
                  : null;

              loadBusinesses(selectedCategoryId);
            }
          );
        }
      );

    } catch (err: unknown) {

      console.error(
        "Error loading categories:",
        err
      );

      categoryContainer.innerHTML = `
                <p class="text-danger small p-2">
                    Failed to load categories.
                </p>
            `;
    }
  }

  async function loadBusinesses(
    categoryId: number | null = null
  ): Promise<void> {

    const listContainer =
      document.querySelector<HTMLElement>(
        "#businesses-list"
      );

    const paginationList =
      document.querySelector<HTMLElement>(
        "#pagination-list"
      );

    if (!listContainer) return;

    listContainer.innerHTML = `
            <div class="text-center py-4 text-muted">
                <div
                    class="spinner-border spinner-border-sm me-2"
                    role="status">
                </div>

                Loading businesses...
            </div>
        `;

    try {

      let url: string = BASE_API_URL;

      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }

      const response: Response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}`
        );
      }

      allBusinesses =
        await response.json() as Business[];

      if (allBusinesses.length === 0) {

        listContainer.innerHTML = `
                    <p class="text-muted p-3">
                        No registered businesses found in this category.
                    </p>
                `;

        if (paginationList) {
          paginationList.innerHTML = "";
        }

        return;
      }

      currentPage = 1;

      renderCurrentPage();

    } catch (error: unknown) {

      console.error(
        "Error loading businesses:",
        error
      );

      listContainer.innerHTML = `
                <div
                    class="alert alert-danger"
                    role="alert">

                    Unable to load businesses at this time.
                    Please check your connection or server.

                </div>
            `;

      if (paginationList) {
        paginationList.innerHTML = "";
      }
    }
  }

  function renderCurrentPage(): void {

    const listContainer =
      document.querySelector<HTMLElement>(
        "#businesses-list"
      );

    if (!listContainer) return;

    listContainer.innerHTML = "";

    const startIndex: number =
      (currentPage - 1) * itemsPerPage;

    const endIndex: number =
      startIndex + itemsPerPage;

    const pageItems: Business[] =
      allBusinesses.slice(
        startIndex,
        endIndex
      );

    pageItems.forEach(
      (business: Business): void => {

        const formattedHours: string =
          formatTimeOnlyRange(
            business.openingTime,
            business.closingTime
          );

        const logo: string =
          business.logoUrl ||
          "/assets/img/LogoPlaceHolder.PNG";

        const cardHtml: string = `
                    <div class="card business-horizontal-card shadow-sm">

                        <div class="card-body p-3">

                            <div class="d-flex align-items-center gap-3">

                                <img
                                    src="${logo}"
                                    class="business-card-img flex-shrink-0"
                                    alt="${business.businessName} Logo"
                                >

                                <div class="d-flex flex-column justify-content-center">

                                    <h5 class="card-title mb-1">

<a
    href="Products.html?businessId=${business.businessId}"
    class="text-decoration-none stretched-link">

                                            ${business.businessName}

                                        </a>

                                    </h5>

                                    <div class="d-flex align-items-center mt-1">

                                        <span
                                            class="badge ${business.isOpen
            ? "badge-status-open"
            : "badge-status-closed"
          } small">

                                            🕒 ${formattedHours}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                `;

        listContainer.insertAdjacentHTML(
          "beforeend",
          cardHtml
        );
      }
    );

    renderPaginationControls();
  }

  function renderPaginationControls(): void {

    const paginationList =
      document.querySelector<HTMLElement>(
        "#pagination-list"
      );

    if (!paginationList) return;

    paginationList.innerHTML = "";

    const totalPages: number =
      Math.ceil(
        allBusinesses.length / itemsPerPage
      );

    if (totalPages <= 1) return;

    // Previous Button
    const isPrevDisabled: boolean =
      currentPage === 1;

    const prevLi: HTMLLIElement =
      document.createElement("li");

    prevLi.className =
      `page-item ${isPrevDisabled ? "disabled" : ""
      }`;

    prevLi.innerHTML =
      `<a class="page-link" href="#">Previous</a>`;

    if (!isPrevDisabled) {

      prevLi.addEventListener(
        "click",
        (e: MouseEvent): void => {

          e.preventDefault();

          currentPage--;

          renderCurrentPage();
        }
      );
    }

    paginationList.appendChild(prevLi);

    // Number Buttons
    for (
      let i: number = 1;
      i <= totalPages;
      i++
    ) {

      const pageLi: HTMLLIElement =
        document.createElement("li");

      const isActive: boolean =
        i === currentPage;

      pageLi.className =
        `page-item ${isActive ? "active" : ""
        }`;

      pageLi.innerHTML =
        `<a class="page-link" href="#">${i}</a>`;

      pageLi.addEventListener(
        "click",
        (e: MouseEvent): void => {

          e.preventDefault();

          if (currentPage !== i) {

            currentPage = i;

            renderCurrentPage();
          }
        }
      );

      paginationList.appendChild(pageLi);
    }

    // Next Button
    const isNextDisabled: boolean =
      currentPage === totalPages;

    const nextLi: HTMLLIElement =
      document.createElement("li");

    nextLi.className =
      `page-item ${isNextDisabled ? "disabled" : ""
      }`;

    nextLi.innerHTML =
      `<a class="page-link" href="#">Next</a>`;

    if (!isNextDisabled) {

      nextLi.addEventListener(
        "click",
        (e: MouseEvent): void => {

          e.preventDefault();

          currentPage++;

          renderCurrentPage();
        }
      );
    }

    paginationList.appendChild(nextLi);
  }

  function formatTimeOnlyRange(
    openingStr?: string,
    closingStr?: string
  ): string {

    if (!openingStr || !closingStr) {
      return "Closed";
    }

    const formatSingleTime = (
      timeStr: string
    ): string => {

      const parts: string[] =
        timeStr.split(":");

      let hours: number =
        parseInt(parts[0], 10);

      const minutes: string =
        parts[1] || "00";

      const ampm: string =
        hours >= 12 ? "PM" : "AM";

      hours = hours % 12;

      hours = hours ? hours : 12;

      return `${hours}:${minutes} ${ampm}`;
    };

    return `${formatSingleTime(openingStr)} - ${formatSingleTime(closingStr)}`;
  }

})();