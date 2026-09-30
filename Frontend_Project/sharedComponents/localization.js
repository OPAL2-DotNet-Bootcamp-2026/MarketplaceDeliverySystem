(function () {
  const STORAGE_KEY = "marketplaceLanguage";
  const language = localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
  const arabic = window.marketplaceTranslations || {};
  const english = Object.fromEntries(Object.keys(arabic).map(key => [key, key]));
  Object.assign(english, {
    productCount_one: "{{count}} Product",
    productCount_other: "{{count}} Products"
  });
  Object.assign(arabic, {
    productCount_zero: "لا توجد منتجات",
    productCount_one: "منتج واحد",
    productCount_two: "منتجان",
    productCount_few: "{{count}} منتجات",
    productCount_many: "{{count}} منتجًا",
    productCount_other: "{{count}} منتج"
  });
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const nativeFetch = window.fetch.bind(window);
  const nativeAlert = window.alert.bind(window);

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  i18next.init({
    lng: language,
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    keySeparator: false,
    nsSeparator: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: english },
      ar: { translation: arabic }
    }
  });

  function formatMoney(value) {
    const formatted = new Intl.NumberFormat(language === "ar" ? "ar-OM" : "en-OM", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(Number(value));
    return `${formatted} ${language === "ar" ? "ر.ع." : "OMR"}`;
  }

  function translate(value) {
    const start = value.search(/\S/);
    if (start < 0) return value;
    const end = value.length - (value.match(/\s*$/) || [""])[0].length;
    const trimmed = value.slice(start, end).replace(/\s+/g, " ").trim();
    if (!trimmed || language !== "ar") return value;
    let result = i18next.t(trimmed);
    result = result.replace(/(\d+(?:\.\d{3}))\s+OMR/g, (_, amount) => formatMoney(amount));
    result = result.replace(/^Order #(\S+)$/, (_, id) => `الطلب رقم ${id}`);
    result = result.replace(/^Showing (\d+) of (\d+) orders$/i, (_, shown, total) => `عرض ${shown} من أصل ${total} طلبات`);
    result = result.replace(/^ORDER ITEMS \((\d+)\)$/i, (_, count) => `عناصر الطلب (${count})`);
    result = result.replace(/^Place Order \((.+)\)$/i, (_, amount) => `إتمام الطلب (${amount})`);
    result = result.replace(/^\s*(\d+) Available Items$/i, (_, count) => `${count} عناصر متاحة`);
    result = result.replace(/^(\d+) Products?$/i, (_, count) => i18next.t("productCount", { count: Number(count) }));
    return value.slice(0, start) + result + value.slice(end);
  }

  function translateTextNode(node) {
    const previous = originalText.get(node);
    const source = previous && node.nodeValue === previous.last ? previous.source : node.nodeValue;
    if (!source || !source.trim()) return;
    const next = translate(source);
    originalText.set(node, { source, last: next });
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateAttribute(element, name) {
    if (!element.hasAttribute(name)) return;
    const records = originalAttributes.get(element) || {};
    const current = element.getAttribute(name);
    const previous = records[name];
    const source = previous && current === previous.last ? previous.source : current;
    if (!source) return;
    const next = translate(source);
    records[name] = { source, last: next };
    originalAttributes.set(element, records);
    if (current !== next) element.setAttribute(name, next);
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (!root.parentElement?.closest("script, style, code, pre, textarea, svg")) translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches("script, style, code, pre, textarea, svg")) return;
    for (const name of ["placeholder", "title", "aria-label", "alt"]) translateAttribute(root, name);
    for (const child of root.childNodes) translateTree(child);
  }

  function ensureSwitcher() {
    if (!document.body) return;
    let switcher = document.getElementById("marketplace-language-switcher");
    if (!switcher) {
      switcher = document.createElement("select");
      switcher.id = "marketplace-language-switcher";
      switcher.className = "marketplace-language-switcher";
      switcher.setAttribute("aria-label", "Language / اللغة");
      switcher.innerHTML = '<option value="en">English</option><option value="ar">العربية</option>';
      switcher.value = language;
      switcher.addEventListener("change", async () => {
        const selected = switcher.value === "ar" ? "ar" : "en";
        localStorage.setItem(STORAGE_KEY, selected);
        await i18next.changeLanguage(selected);
        window.location.reload();
      });
    }
    const header = document.querySelector(".header-icons");
    const target = header || document.body;
    if (switcher.parentElement !== target) target.append(switcher);
    switcher.classList.toggle("language-floating", !header);
  }

  // The existing pages fetch catalog data directly. Supply their chosen language
  // to ASP.NET without changing authentication headers or request bodies.
  window.fetch = function (input, init) {
    try {
      const url = new URL(input instanceof Request ? input.url : input, location.href);
      if (url.port === "7299" && (/^\/api\//i.test(url.pathname) || /^\/delivery\//i.test(url.pathname))) {
        const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
        headers.set("Accept-Language", language);
        return nativeFetch(input, { ...init, headers });
      }
    } catch { /* Preserve native fetch handling for unusual request inputs. */ }
    return nativeFetch(input, init);
  };

  window.alert = function (message) {
    return nativeAlert(typeof message === "string" ? translate(message) : message);
  };

  window.MarketplaceI18n = { language, t: key => i18next.t(key), formatMoney };

  function start() {
    ensureSwitcher();
    if (language === "ar") translateTree(document.documentElement);
    const observer = new MutationObserver(changes => {
      ensureSwitcher();
      if (language !== "ar") return;
      for (const change of changes) {
        if (change.type === "characterData") translateTree(change.target);
        else if (change.type === "attributes") translateAttribute(change.target, change.attributeName);
        else for (const node of change.addedNodes) translateTree(node);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
      subtree: true
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
