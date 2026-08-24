# Etsy selector strategy

Etsy changes its editor periodically. All field discovery is centralized in `content/etsy-map.js`.

For each field, SIDEKICK tries:

1. Stable `name` and `data-field` selectors.
2. Case-insensitive `aria-label` selectors.
3. Visible `<label>` text and its `for` relationship.
4. A control nested inside the matching label.

Only visible, enabled controls are eligible. Controlled inputs use the native value setter followed by bubbling `input`, `change`, and `blur` events. SIDEKICK reads the value back and marks a mismatch **Needs review**.

Tags use their own sequential routine. Blank and case-insensitive duplicate tags are removed before entry. Each tag receives Enter key events and a short settle period. A tag is attempted once only; failures are reported without retry loops.

Category remains manual because selecting the wrong taxonomy branch is worse than saving a click. Update `listingUrlPatterns`, field mappings, and tag input selectors here when Etsy changes—do not scatter Etsy selectors through the popup.

## Live verification — August 24, 2026

The logged-in Etsy editor at `/your/shops/me/listing-editor/edit/{id}` exposed the following accessible UI:

- Title: textbox named `Title Help`
- Description: textbox named `Description`
- Tags: group named `Tags`, textbox named `Add tag`, and per-tag `Remove` buttons
- Price: textbox named `Price`
- Quantity: textbox named `Quantity`
- SKU: initially a button named `Add SKU`; SIDEKICK may reveal this control before filling
- Final seller control: button named `Publish changes`; SIDEKICK never queries or interacts with it

Image and digital-file controls use browser file pickers and remain intentionally manual.
