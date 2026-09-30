// Landing page after Thawani redirects back. Asks our backend to verify the payment.

interface VerifyResponse {
    success: boolean;
    message: string;
    orderId: number;
    paymentStatus: string;
}

type ResultState = "loading" | "success" | "failed";

const VERIFY_PAYMENT_API: string = "https://localhost:7299/api/Payment/verify";

document.addEventListener("DOMContentLoaded", () => {
    void verifyPayment();
});

async function verifyPayment(): Promise<void> {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    const token = localStorage.getItem("authToken");

    if (!orderId || !/^\d+$/.test(orderId)) {
        showResult("failed", "Payment not found", "No order was specified.");
        return;
    }

    if (!token) {
        window.location.href = "Login.html";
        return;
    }

    try {
        // The URL "status" param is ignored on purpose: only Thawani's answer counts.
        const response = await fetch(`${VERIFY_PAYMENT_API}/${orderId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("Verify failed:", response.status);
            showResult("failed", "Could not verify payment", "Please check your order history in a moment.");
            return;
        }

        const result: VerifyResponse = await response.json();

        if (result.success) {
            showResult("success", "Payment successful", `Order #${result.orderId} is paid. Thank you!`);
        } else {
            showResult("failed", "Payment not completed", result.message);
        }
    } catch (err) {
        console.error("Network error while verifying payment:", err);
        showResult("failed", "Connection problem", "We couldn't reach the server. Please try again.");
    }
}

function showResult(state: ResultState, title: string, message: string): void {
    const card = document.getElementById("resultCard");
    const titleEl = document.getElementById("resultTitle");
    const messageEl = document.getElementById("resultMessage");
    const trackBtn = document.getElementById("trackBtn");
    const retryBtn = document.getElementById("retryBtn");

    if (card) card.dataset.state = state;
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (trackBtn) trackBtn.hidden = state === "failed";
    if (retryBtn) retryBtn.hidden = state !== "failed";
}
