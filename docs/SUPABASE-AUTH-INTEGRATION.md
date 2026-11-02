# Supabase Auth integration — Bagusin

Last updated: 2 November 2026

## Live project

- Project ref: \`hpmeoxynftankklwgntb\`
- API URL: \`https://hpmeoxynftankklwgntb.supabase.co\`
- Frontend: GitHub Pages at \`https://baguskristiansianturi.github.io/bagusin/\`
- Client SDK: pinned \`@supabase/supabase-js@2.118.0\` UMD build.
- Client credential: publishable key only. Never place a secret/service-role key or database password in frontend code.

## What is connected in this phase

- Email/password registration and sign-in.
- Email confirmation and password reset links back to the matching Indonesian/English account page.
- Persistent browser session and sign-out.
- Profile read/update for the signed-in user.
- A global account entry point injected into the shared desktop/mobile navigation.
- New-user profile bootstrap from Supabase Auth metadata.
- Member/admin role column with a database trigger preventing a member from changing their own role.

The existing static site and its page-specific HTML/CSS remain in place. The adapter loads from the global \`js/main.js\`; pages without that global script will not display the account entry point.

## Supabase dashboard setup still required

In Supabase Dashboard → Authentication → URL Configuration:

1. Set Site URL to \`https://baguskristiansianturi.github.io/bagusin/\`.
2. Add these Redirect URLs:
   - \`https://baguskristiansianturi.github.io/bagusin/account/\`
   - \`https://baguskristiansianturi.github.io/bagusin/en/account/\`
3. Keep email/password provider enabled.
4. For production, use a verified sender/custom SMTP if higher email delivery reliability is needed; the built-in email service is rate-limited.

## First owner/admin bootstrap

1. Register the owner's email through the Bagusin account page.
2. Confirm the email using the confirmation link.
3. In Supabase SQL Editor, promote only the verified owner account by exact email:

\`\`\`sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'OWNER_EMAIL'
);
\`\`\`

Replace \`OWNER_EMAIL\` with the owner's exact login email. Never expose this SQL through a public frontend or let a registration form assign the admin role.

## Not included yet

- Image/video uploads and Storage buckets/policies for user-generated posts.
- Explore feed, likes, comments, communities, and moderation UI.
- Admin dashboard/content editor.
- Migration of existing static articles/catalog data into database records.
- Payment, email marketing, or transactional email flows.

## Verification checklist

- [ ] Add the two redirect URLs in Supabase Dashboard.
- [ ] Test registration and confirmation from a real email inbox.
- [ ] Test sign-in, refresh persistence, sign-out, password reset, and profile update on Android.
- [ ] Promote the verified owner to admin.
- [ ] Confirm the account page and nav links on ID/EN pages after GitHub Pages deployment.
