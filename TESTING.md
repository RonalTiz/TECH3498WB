# Website tests

Run the suite from the project folder:

```powershell
npm test
```

It uses Node.js's built-in test runner and does not require extra packages. It checks local HTML links and assets, page anchors, literal navigation/fetch routes, and the `/api/chat` input contract. API tests use a placeholder key and do not send requests to OpenAI.

To point the tests at another checkout, set `SITE_ROOT` before running them:

```powershell
$env:SITE_ROOT = 'C:/path/to/TECH3498WB'
npm test
```

These are source and API contract checks, not browser end-to-end tests. They do not sign in to Supabase or access production data.
