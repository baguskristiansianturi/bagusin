# Supabase — Bagusin

This directory contains the SQL migration history for the live Bagusin Supabase project.

## Project

- Project ref: \`hpmeoxynftankklwgntb\`
- API URL: \`https://hpmeoxynftankklwgntb.supabase.co\`
- Frontend remains hosted separately on GitHub Pages.

Only the publishable key is used by the browser adapter. Never commit a service-role/secret key, database password, or admin token.

## Migration history

The following migrations are already applied to the live project and versioned here in the same order:

1. \`20261102130800_bagusin_foundation_schema_v1.sql\` — profiles, posts, comments, reactions, articles, communities, and design catalog tables; RLS and initial grants.
2. \`20261102130818_bagusin_profile_trigger_and_timestamps.sql\` — private Auth profile bootstrap and updated-at triggers.
3. \`20261102130847_bagusin_lock_anon_writes_and_index_fks.sql\` — explicitly revoke anonymous writes and index foreign keys.
4. \`20261102131414_profile_auth_role.sql\` — member/admin role, display-name bootstrap, and role-change guard.

Do not apply an older alternative foundation migration from an unmerged branch on top of this live schema. The migration history above is the source of truth for this project.

## Auth dashboard configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Site URL: \`https://baguskristiansianturi.github.io/bagusin/\`
- Redirect URLs:
  - \`https://baguskristiansianturi.github.io/bagusin/account/\`
  - \`https://baguskristiansianturi.github.io/bagusin/en/account/\`

Email/password provider should remain enabled.

## First owner/admin

Register the owner's account from the Bagusin account page and confirm the email. Then promote the exact owner account in SQL Editor:

\`\`\`sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'OWNER_EMAIL'
);
\`\`\`

Replace \`OWNER_EMAIL\` with the owner's exact login email. Never expose this operation to the public frontend.

## Next phases

Storage uploads, Explore feed UI, moderation, comments/reactions, communities, editorial/catalog/course admin tools, and migration of existing static content are separate implementation phases.
