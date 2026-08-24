# PASS 2 manual testing checklist

## Package handling

- Load a valid SHOPMINT v1.2 package; confirm name, type, title, price, tags, creation details, and version.
- Load a valid legacy v1.0 package.
- Try malformed JSON, an unsupported version, missing fields, and more than 13 tags.
- Replace and remove the current package, close/reopen the popup, and confirm storage behavior.

## Page safety

- Open an unrelated site; the popup must say **Open an Etsy listing** and disable fill.
- Open an Etsy non-listing page; fill must remain disabled.
- Open a supported create/edit listing URL; detection must be real, not inferred from the tab title.
- Search the source for publish/submission actions; none should exist.

## Autofill

- Test Everything, Text only, and Tags only.
- Confirm title, description, price, quantity, and SKU produce native page events.
- Confirm blank and duplicate tags are skipped and no tag is retried continuously.
- Confirm missing fields appear under Not found or Needs review.
- Confirm category, listing images, and digital files are always reported Manual.
- Refresh Etsy and rerun once to verify no duplicate tag burst.

## Fallback and UI

- Test all five copy buttons.
- Minimize and restore the page-side panel.
- Verify popup states at 390 px and at browser zoom 80–125%.
- Confirm SHOPMINT continues to create, save, preview, package, and export products with the extension uninstalled.

Live Etsy verification requires a logged-in seller account and should be repeated whenever Etsy changes its editor DOM.
