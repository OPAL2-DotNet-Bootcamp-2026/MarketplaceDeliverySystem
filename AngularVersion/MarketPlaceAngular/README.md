# Marketplace Angular frontend

Angular 22 refactor of the marketplace frontend. The original native HTML, CSS, JavaScript, and TypeScript implementation remains in `../../Frontend_Project` for reference.

## Structure

The application uses the same folder responsibilities as the supplied Angular reference while keeping the Marketplace pages and its existing API contract:

```text
src/app/
├── components/   Reusable UI components
├── layout/       Header, sidebar, and footer
├── models/       API and application types
├── pages/        Routed page components
└── services/     HTTP, authentication, cart, and order state
```

The migrated routes cover home, businesses, products, checkout, order history, tracking, driver information, delivery updates, login, and registration. The course sample's Shop pages and `/api/products` endpoint are not copied into this application. No new authentication mechanism is added; the existing backend still requires a login for protected marketplace endpoints. The business, product, order, tracking, driver-info, and checkout pages open the existing login-required view when login is missing or the backend responds with 401 or 403; connection failures keep their own error message.

## Run locally

The frontend expects the existing ASP.NET Core API at `https://localhost:7299`.

```bash
npm install
npm start
```

Open `http://localhost:4200` after both the API and Angular development server are running. The start command uses `proxy.conf.json` to forward `/api` and `/delivery` to the API, so the backend does not need a CORS change for local development. If the API address changes, update the proxy target.

For a production deployment where Angular and the API use different origins, the backend CORS allowlist must include the Angular origin. That backend change is intentionally not included here.

## Verify

```bash
npm run build
```
