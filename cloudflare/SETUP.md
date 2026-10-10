# Bagusin Cloudflare backend foundation

This directory is a staged backend foundation. It is deliberately not wired into the live deployment yet: the existing GitHub Pages and Cloudflare Worker must remain unchanged until the D1 database is created and the deployment is verified.

## What is included

- `worker.js`: health endpoint and validated inquiry endpoint.
- `schema.sql`: D1 table and indexes for service inquiries.
- `wrangler.example.jsonc`: configuration template; it is not deploy-ready until the real D1 database ID is inserted.

## Activate safely

1. In Cloudflare Dashboard, open **Workers & Pages → D1 SQL Database → Create database** and name it `bagusin-inquiries`.
2. Open the database's Console and execute `schema.sql` (or use Wrangler with the database's actual ID).
3. Copy this template to the repository root as `wrangler.jsonc` only when ready to configure the Worker. Replace the placeholder `database_id` with the actual ID.
4. Ensure the Worker static-assets directory serves the existing site files while excluding repository metadata and the private setup files from public assets. Verify this before deploying.
5. Deploy to a preview or a separate Worker first; do not replace the current production Worker until both `/api/health` and a test inquiry work.
6. Email delivery is intentionally not marked as active by this scaffold. Configure a verified email provider/binding (or a server-side email service) and test delivery to **sbaguskristian@gmail.com** before enabling the frontend submission flow.
7. Only after successful tests should the contact form be switched from its current provider to `POST /api/inquiries`.

## Safety and privacy

- The API validates content and consent, checks the honeypot, limits payload size, and avoids logging submitted personal data.
- No public endpoint for reading or listing inquiries is provided. A private admin workflow and authentication must be designed before adding one.
- Do not commit API keys, credentials, or personal submission data.
- The current public site and GitHub Pages are not modified by this branch.
