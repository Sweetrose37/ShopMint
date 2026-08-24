# SHOPMINT™ SIDEKICK

Manifest V3 Chrome companion for SHOPMINT Listing Packages. Load this exact `extension` directory via Chrome's **Load unpacked** button.

## Permissions

- `storage`: retains the current listing package locally during the workflow.
- `activeTab`: communicates with the current user-selected Etsy listing tab after the user opens the popup.
- Etsy host access is limited to `etsy.com/your/shops/*` and `etsy.com/listing/*`. Content logic additionally verifies a listing create/edit URL before filling.

No Etsy credentials or account data are read or stored. Product content is not logged. The service worker stores only the package the user explicitly loads.

## Safe workflow

1. Export `*-shopmint-sidekick.json` from the SHOPMINT app.
2. Load the JSON in the popup.
3. Open an Etsy listing create or edit page while already signed in.
4. Choose **Everything supported**, **Text only**, or **Tags only**.
5. Click **FILL MY LISTING**.
6. Review the completion report and the Etsy form.
7. Upload listing images and digital delivery files manually.
8. Publish manually only after review.

The extension contains no code that finds or clicks Etsy publish/submit buttons.

See [SELECTORS.md](SELECTORS.md) for maintenance and [MANUAL-TESTING.md](MANUAL-TESTING.md) for release checks.
