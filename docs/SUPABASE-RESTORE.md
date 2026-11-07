# Restore Supabase from dashboard backup

Use this when a Supabase project is paused past its restore window. Create a **new** hosted project, restore the SQL dump into it, then point this app at the new `DATABASE_URL`.

Official reference: [Restore Dashboard backup](https://supabase.com/docs/guides/platform/migrating-within-supabase/dashboard-restore).

Backup in this repo (do **not** commit it):

```text
./supabase/db_cluster-09-03-2024@12-18-05.backup
```

It is a **plain SQL** cluster dump (UTF-8). It is not gzipped; no unzip step.

---

## 1. Create a new Supabase project

1. Go to [database.new](https://database.new) (or Dashboard → **New project**).
2. Pick a **strong database password** and save it in a password manager.
3. Choose region **Europe (Frankfurt)** if you want to stay near the old `eu-central-1` setup.
4. Wait until the project status is **Active** (not paused).

Note the **new project ref** from the URL:

```text
https://supabase.com/dashboard/project/<NEW_PROJECT_REF>
```

---

## 2. Prepare the connection string

1. Open the new project → **Connect**.
2. Copy the **Session pooler** URI (port **5432**), user `postgres.<NEW_PROJECT_REF>`.
3. Replace `[YOUR-PASSWORD]` with the database password from step 1.
4. Append SSL if missing:

```text
?sslmode=require
```

Example shape (yours will differ):

```text
postgresql://postgres.<NEW_PROJECT_REF>:<URL-encoded-password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
```

If you reset the password in **Database → Settings**, wait **2–5 minutes** before connecting.

**Tip:** Copy the URI from the dashboard so the password is already URL-encoded. Do not paste a raw password that contains `%` or `,` into the URL by hand.

### Test connect (optional)

From this repo root:

```bash
psql "$DATABASE_URL" -c 'select 1'
```

---

## 3. Restore the backup with `psql`

Requires **PostgreSQL client 16+** (you have `psql` locally).

From the **repository root**:

```bash
export DATABASE_URL='postgresql://postgres.<NEW_PROJECT_REF>:<PASSWORD>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require'

psql "$DATABASE_URL" \
  -v ON_ERROR_STOP=0 \
  -f "./supabase/db_cluster-09-03-2024@12-18-05.backup" \
  2>&1 | tee restore.log
```

Notes:

- **`ON_ERROR_STOP=0`** — keep going when Supabase already has `auth`, `storage`, etc. (you will see many **“already exists”** messages; that is normal per Supabase docs).
- The run can take several minutes.
- Scan `restore.log` for real failures (auth errors, connection drops), not benign “already exists”.

---

## 4. Point the Netflix clone at the new database

### Local

```bash
vercel env pull .env.local -p netflix-clone-next14   # optional, if Vercel is already updated
```

Edit `.env.local` → set `DATABASE_URL` to the **new** connection string.

```bash
npm run check:db
npm run dev
```

### Prisma

After a full SQL restore, tables may already exist. Prefer:

```bash
npx prisma db pull    # optional: sync schema.prisma from DB
npx prisma generate
```

Only run `npx prisma db push` if you know the restore did not create the `Movie` / `WatchList` / NextAuth tables.

### Vercel

1. [Project env settings](https://vercel.com) → **Environment Variables**.
2. Update **`DATABASE_URL`** for Production / Preview / Development.
3. Redeploy.

---

## 5. Link Supabase CLI (optional)

After the new project is **Active**:

```bash
npx supabase login
npx supabase link --project-ref <NEW_PROJECT_REF>
```

---

## 6. What this restore does **not** bring back

| Item | Action |
|------|--------|
| **OAuth client IDs** (Google/GitHub) | Still in Vercel / `.env` — unchanged |
| **Supabase Auth settings / API keys** | New project → new **anon** / **service_role** keys if you use Supabase client (this app uses Prisma + NextAuth, not Supabase Auth SDK) |
| **Storage file bytes** | Only DB metadata may restore; re-upload files if you used Storage |
| **Edge Functions** | Recreate in new project |

For this app, the critical part is **Postgres** (`User`, `Session`, `Account`, `Movie`, `WatchList`, etc.).

---

## 7. Troubleshooting

| Error | Fix |
|-------|-----|
| `SCRAM ... Wrong password` | Wait after password reset; use dashboard URI with encoded password |
| `invalid response to GSSAPI` | Upgrade local `psql` (use Postgres 16+) |
| `Can't reach database server` | Project paused or wrong host/ref |
| Many `already exists` | Expected; check `restore.log` for non-ignored failures |

---

## 8. After success

1. Sign in at [http://localhost:3000](http://localhost:3000) (email or OAuth).
2. If the catalog is empty but schema exists, use **`/seed`** in **development** only, or rely on restored `Movie` rows from the backup.

The previous project ref can stay paused or be deleted once you are satisfied with the new database.
