(function () {
    const API = "https://localhost:7299/api";
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const state = { productId: null, pollTimer: null, polls: 0, dirty: false, refreshing: false };
    const element = id => document.getElementById(id);
    const t = key => window.MarketplaceI18n?.t(key) || key;

    function notice(message, kind = "info") {
        const box = element("pageMessage");
        box.textContent = t(message);
        box.className = `notice${kind === "error" ? " notice-error" : kind === "success" ? " notice-success" : ""}`;
        box.hidden = false;
    }

    async function api(path, options = {}) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        if (options.body) headers.set("Content-Type", "application/json");
        const response = await fetch(`${API}${path}`, { ...options, headers });
        const raw = await response.text();
        let data = raw;
        try { data = raw ? JSON.parse(raw) : null; } catch { /* Plain text response. */ }
        if (!response.ok) {
            const detail = typeof data === "string" ? data : data?.title;
            throw new Error(detail || `${t("Request failed")} (${response.status})`);
        }
        return data;
    }

    function fillSelect(select, items, idKey, nameKey, placeholder) {
        select.replaceChildren(new Option(t(placeholder), ""));
        for (const item of items) select.add(new Option(item[nameKey], String(item[idKey])));
    }

    async function loadOptions() {
        try {
            const [businesses, categories] = await Promise.all([
                api("/Business/my-businesses"),
                api("/Category/GetSidebarCategories")
            ]);
            fillSelect(element("businessId"), businesses, "businessId", "businessName", "Choose a business");
            fillSelect(element("categoryId"), categories, "categoryId", "categoryName", "Choose a category");
            if (businesses.length === 1) element("businessId").value = String(businesses[0].businessId);
            if (categories.length === 0) notice("No product categories are available.", "error");
            if (businesses.length === 0) notice("No business is linked to this account. Register a business before adding products.", "error");
            element("createButton").disabled = businesses.length === 0 || categories.length === 0;
        } catch (error) {
            notice("Unable to load your businesses or categories. Check the API and sign in again.", "error");
            element("createButton").disabled = true;
            console.error("Could not load product form options:", error);
        }
    }

    function stopPolling() {
        if (state.pollTimer) clearTimeout(state.pollTimer);
        state.pollTimer = null;
    }

    function schedulePoll() {
        stopPolling();
        if (state.polls >= 24) {
            element("translationStatus").textContent = t("Translation is still pending. Check the Azure Translator configuration, or refresh later.");
            return;
        }
        state.pollTimer = setTimeout(refreshTranslation, 5000);
    }

    async function refreshTranslation() {
        if (!state.productId || state.refreshing) return;
        state.refreshing = true;
        state.polls++;
        try {
            const product = await api(`/catalog-translations/products/${state.productId}`);
            if (!state.dirty) {
                element("productNameAr").value = product.productNameAr || "";
                element("descriptionAr").value = product.descriptionAr || "";
            }
            let status = "Arabic text is ready. Review it and save any corrections.";
            if (product.translationPending && product.autoTranslationConfigured === false)
                status = "Automatic translation is not configured on the server. Enter Arabic yourself or ask an administrator to configure Azure Translator.";
            else if (product.productNameArNeedsReview || product.descriptionArNeedsReview)
                status = "The English text changed. Please review the Arabic text.";
            else if (product.translationPending && product.translationAttempts > 0)
                status = "Translation is delayed. You can enter Arabic yourself or refresh later.";
            else if (product.translationPending)
                status = "Arabic translation is being prepared.";
            element("translationStatus").textContent = t(status);
            if (product.translationPending && product.autoTranslationConfigured !== false && product.translationAttempts === 0) schedulePoll();
            else stopPolling();
        } catch (error) {
            element("translationStatus").textContent = t("Unable to load the Arabic translation. Please refresh.");
            stopPolling();
            console.error("Could not load product translation:", error);
        } finally {
            state.refreshing = false;
        }
    }

    async function createProduct(event) {
        event.preventDefault();
        const button = element("createButton");
        button.disabled = true;
        const businessId = element("businessId").value;
        const categoryId = element("categoryId").value;
        const payload = {
            businessId: Number(businessId),
            categoryId: Number(categoryId),
            productName: element("productName").value.trim(),
            description: element("description").value.trim() || null,
            price: Number(element("price").value),
            stockQuantity: Number(element("stockQuantity").value),
            imageUrl: element("imageUrl").value.trim() || null
        };
        try {
            const created = await api("/Product", { method: "POST", body: JSON.stringify(payload) });
            state.productId = created.productId;
            state.polls = 0;
            state.dirty = false;
            stopPolling();
            element("translationPanel").hidden = false;
            element("productNumber").textContent = `${t("Product ID")}: #${created.productId}`;
            element("translationStatus").textContent = t("Checking Arabic translation status...");
            element("productNameAr").value = "";
            element("descriptionAr").value = "";
            notice("Product saved.", "success");
            element("productForm").reset();
            element("businessId").value = businessId;
            element("categoryId").value = categoryId;
            await refreshTranslation();
        } catch (error) {
            notice(error.message || "Could not save the product.", "error");
        } finally {
            button.disabled = false;
        }
    }

    async function saveArabic(event) {
        event.preventDefault();
        if (!state.productId) return;
        const button = element("saveArabicButton");
        button.disabled = true;
        stopPolling();
        try {
            await api(`/catalog-translations/products/${state.productId}`, {
                method: "PUT",
                body: JSON.stringify({
                    nameAr: element("productNameAr").value.trim() || null,
                    descriptionAr: element("descriptionAr").value.trim() || null
                })
            });
            state.dirty = false;
            state.polls = 0;
            notice("Arabic changes saved.", "success");
            await refreshTranslation();
        } catch (error) {
            notice(error.message || "Could not save the Arabic changes.", "error");
        } finally {
            button.disabled = false;
        }
    }

    function init() {
        element("logoutButton").addEventListener("click", () => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userFullName");
            window.location.href = "Login.html";
        });
        if (!token || role !== "BusinessOwner") {
            element("authNotice").hidden = false;
            element("logoutButton").hidden = true;
            return;
        }
        element("ownerName").textContent = localStorage.getItem("userFullName") || "Business Owner";
        element("formPanel").hidden = false;
        element("productForm").addEventListener("submit", createProduct);
        element("translationForm").addEventListener("submit", saveArabic);
        element("refreshButton").addEventListener("click", refreshTranslation);
        element("productNameAr").addEventListener("input", () => { state.dirty = true; });
        element("descriptionAr").addEventListener("input", () => { state.dirty = true; });
        window.addEventListener("pagehide", stopPolling);
        loadOptions();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
