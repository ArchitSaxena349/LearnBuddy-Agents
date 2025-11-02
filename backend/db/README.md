# Database migrations (Supabase)

This folder contains SQL migrations for the LearnBuddy backend. The provided migration is intended to be applied to a Supabase Postgres database.

Files
- migrations/001_init.sql — initial schema: profiles, courses, lessons, enrollments, companion_messages, sessions.

How to apply

Option A — Supabase Dashboard (quick)
1. Open your Supabase project in the browser.
2. Go to "SQL Editor" and create a new query.
3. Paste the contents of `migrations/001_init.sql` and run it.

Option B — Supabase CLI (recommended for repeatable migrations)
1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Login and link to your project:

   supabase login
   supabase link --project-ref <YOUR_PROJECT_REF>

3. Place migrations in a folder the CLI expects (for example `supabase/migrations`), or use `supabase db remote set <DATABASE_URL>` and run the SQL directly. One simple way:

   # apply single file directly
   supabase db query "$(Get-Content -Raw backend/db/migrations/001_init.sql)"

Or push migrations if you use the CLI migration workflow:

   supabase migrations new init
   # copy SQL into the generated migration file, then
   supabase db push

Option C — psql / any Postgres client
1. Get the database connection string (Supabase > Settings > Database > Connection string)
2. Run:

   psql "<CONNECTION_STRING>" -f backend/db/migrations/001_init.sql

Notes
- The migration enables the `pgcrypto` extension and uses `gen_random_uuid()` for UUID generation.
- `profiles.auth_id` is provided as a place to store the Supabase Auth user's UUID if you want to link auth users to the `profiles` table.
- Adjust column names and types to your needs before applying.

If you'd like, I can:
- Move the migration into a `supabase/migrations` layout compatible with the CLI's migration workflow.
- Generate additional migrations (example seed data, indexes, RBAC policies).
