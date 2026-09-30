# English and Arabic in Frontend_Project

The ten HTML pages load pinned i18next 26.4.2, `sharedComponents/translations.js`,
and `sharedComponents/localization.js`. The language control is placed in the
shared header, or at the top of login and registration pages. It saves `en` or
`ar` in `localStorage` as `marketplaceLanguage`, then reloads the current page
so API content is requested in the selected language. The Arabic view sets
`lang="ar"` and `dir="rtl"`.

`localization.js` sends `Accept-Language` to the existing API. The backend
returns the Arabic catalog field when populated, otherwise the English field.
Order, payment, and delivery status values remain unchanged in API responses
and requests. The frontend translates only their displayed labels. Existing
cart quantities and prices are preserved while checkout refreshes product
names for the selected language.

## Populate catalog translations

Apply both the `AddArabicCatalogFields` and `AddProductAutoTranslation` EF
migrations before running the updated API. Existing rows display English until
Arabic copy is supplied or generated. An Admin token may update translations
with these endpoints:

| Endpoint | JSON body |
| --- | --- |
| `PUT /api/catalog-translations/products/{id}` | `{"nameAr":"...","descriptionAr":"..."}` |
| `PUT /api/catalog-translations/businesses/{id}` | `{"nameAr":"...","descriptionAr":"..."}` |
| `PUT /api/catalog-translations/categories/{id}` | `{"nameAr":"...","descriptionAr":"..."}` |
| `PUT /api/catalog-translations/business-categories/{id}` | `{"nameAr":"..."}` |

## Automatic product translation

The backend uses [Azure AI Translator's text API](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/how-to/use-rest-api)
to generate Arabic product names and descriptions. Set these backend
configuration values through environment variables or a secret manager:

| Configuration key | Environment variable | Purpose |
| --- | --- | --- |
| `Translation:ApiKey` | `Translation__ApiKey` | Azure Translator resource key. Required to start the worker. |
| `Translation:Region` | `Translation__Region` | Resource region. Required for regional or multi-service resources. |
| `Translation:Endpoint` | `Translation__Endpoint` | Optional base URL. Defaults to `https://api.cognitive.microsofttranslator.com`; use the full `/translator/text/v3.0` base path for a private/custom endpoint. |

Keep the key on the backend; never add it to frontend JavaScript or committed
configuration. The worker scans up to 20 products every 30 seconds. It
translates missing Arabic fields for new and existing products, writes the
result to the same product row, and retries failed calls with a delay. Without
a configured key, the worker does not run and English fallback remains in use.

`POST /api/Product` creates a product for an authenticated BusinessOwner of
the selected business or an Admin. It accepts `businessId`, `categoryId`,
`productName`, optional `description`, `price`, `stockQuantity`, and optional
`imageUrl`, `productNameAr`, and `descriptionAr`. The existing
`PUT /api/Product/update/{id}` is also restricted to that owner or an Admin.
An English edit clears only machine-generated Arabic for retranslation.
Seller-provided Arabic remains intact and is flagged for review after its
English source changes.

Owners and Admins can read a product's English and Arabic copy, pending state,
and review flags with `GET /api/catalog-translations/products/{id}`. They can
correct or approve both Arabic fields with the product `PUT` endpoint in the
table above. Sending a null or empty field clears it and queues that field for
automatic translation. The other catalog translation endpoints remain Admin
only. `Frontend_Project` currently has no seller editing page; this review
workflow is available through the backend API.

Category icons continue to use the English category name returned in
`categoryNameEn`, while the visible name uses the selected language. Product
search checks both English and Arabic names.

The legacy pages load some scripts from `Typescript/dist` and others from
`JavaScript`. When changing a TypeScript page, rebuild `Typescript/src` into
`Typescript/dist` with its `tsconfig.json` before shipping.
