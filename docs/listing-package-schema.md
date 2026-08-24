# SHOPMINT Listing Package schema 1.1.0

SIDEKICK accepts `schemaVersion` values `1.0.0` and `1.1.0`. Unknown fields are ignored for forward compatibility; missing required fields produce a clear import error.

Required fields: `schemaVersion`, `productId`, `productName`, `productType`, `title`, `description`, `tags` (maximum 13 strings), `price` (number), `quantity` (integer), `sku`, `categorySuggestion`, `materials`, `primaryColor`, `secondaryColor`, `occasion`, `holiday`, `personalization`, `includedFiles`, `mockups` (metadata array), `createdAt`, and `updatedAt` (ISO-8601 timestamps).

Version 1.1 adds `exportedBy`, `exportPurpose`, sale price, digital disclosure/customer copy, source-file metadata, `imageChecklist`, and `deliveryChecklist`. The original 1.0 fields remain unchanged.

The export intentionally contains no binary source files, paths, or mockup data URLs. It contains filenames and metadata only. Binaries remain in the separately generated ZIP/customer package. This keeps extension imports small, avoids browser file-permission workarounds, and stays within extension messaging limits.

Field semantics:

- `imageChecklist`: ordered mockup metadata for manual Etsy image upload.
- `deliveryChecklist`: customer-selected filenames and sizes for manual digital-file upload.
- `mockups`: listing-preview metadata; never treated as customer delivery files.
- `exportPurpose`: fixed to `sidekick-listing-assist` so later importers can distinguish this package from other SHOPMINT exports.
