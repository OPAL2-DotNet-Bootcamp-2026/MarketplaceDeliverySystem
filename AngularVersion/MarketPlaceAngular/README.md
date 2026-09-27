# Marketplace Angular frontend

Angular 22 refactor of the marketplace frontend. The original native HTML, CSS, JavaScript, and TypeScript implementation remains in `../../Frontend_Project` for reference.

## Structure

The application follows the same feature structure as the supplied Angular reference:

```text
src/app/
├── components/   Reusable UI components
├── layout/       Header, sidebar, and footer
├── models/       API and application types
├── pages/        Routed page components
└── services/     HTTP, authentication, cart, and order state
```

The migrated routes cover home, businesses, products, checkout, order history, tracking, driver information, delivery updates, login, and registration.

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
npm test -- --watch=false
```
