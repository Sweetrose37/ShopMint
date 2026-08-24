# SHOPMINT™ — PASS 2

A local-first creative commerce studio plus the SHOPMINT™ SIDEKICK Chrome companion for review-first Etsy listing assistance.

## Run locally

```bash
npm install
npm run dev
```

Production check: `npm run build`, then `npm run preview`.

The hosted QA build contains only the standalone browser app. The `extension/` directory remains a desktop-only, unpacked Chrome companion and is intentionally excluded from Vite's `dist/` output.

Public QA: `https://sweetrose37.github.io/ShopMint/`. GitHub Pages deploys the standalone app from `main`; the Sidekick extension is not part of the Pages artifact.

All projects and settings are stored in browser `localStorage`; uploaded file data never leaves the browser. Large files are limited to 25 MB per local preview because browser storage varies by device.

## PASS 2 listing contract

The extension-ready export is a UTF-8 JSON document with `schemaVersion: "1.1.0"`. Version 1.0 remains accepted by SIDEKICK. See [`docs/listing-package-schema.md`](docs/listing-package-schema.md). The implementation source of truth is `createListingPackage()` in `src/schema.ts`.

## Install SHOPMINT SIDEKICK

1. Open Chrome and visit `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select the [`extension`](extension) folder—not the project root.
5. Pin **SHOPMINT™ SIDEKICK**.
6. In SHOPMINT, open a product and select **Sidekick**.
7. Export the Sidekick JSON package and load it in the extension popup.
8. Open an Etsy listing create/edit page, choose a fill mode, and click **FILL MY LISTING**.
9. Review every field and publish manually when satisfied.

SIDEKICK never clicks publish, submits final seller actions, stores Etsy credentials, uploads local files, or operates outside supported Etsy listing URLs.

## Browser-only notes

- Mockups are rendered with Canvas and exported as JPEGs.
- Customer packages are built as ZIP files entirely in the browser.
- Source files are not modified. Watermarks apply only to mockup exports.
- Browser storage quotas differ. A future migration to IndexedDB is recommended for catalogs containing many large embedded files.
