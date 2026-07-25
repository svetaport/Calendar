# Shared September 2026 Calendar

This folder contains a GitHub Pages-ready calendar for 18–29 September 2026. Reservations are stored in Supabase and protected by a private invite link.

## 1. Create the Supabase table

1. Create a Supabase project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor**.
3. Paste the contents of `supabase-schema.sql` and run it.
4. In **Project Settings → API**, copy the **Project URL** and the public **anon key**.
5. In **Authentication → Providers → Anonymous**, enable **Allow anonymous sign-ins** and save.

The schema uses row-level security. A browser can read, create, edit, or delete bookings only after it opens a valid invite link. Do not put a Supabase service-role key in the page.

## 2. Add the Supabase settings

Open `index.html` and replace these two values near the top of the script:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

You can use a calendar-specific link such as:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?calendar=team-planning
```

Everyone using the same `calendar=` value sees the same bookings. If the parameter is omitted, the calendar name is `shared`.

## 3. Publish with GitHub Pages

1. Create a GitHub repository.
2. Copy both `index.html` and `invite-access.js` into the repository root.
3. Commit and push both files.
4. In GitHub, open **Settings → Pages**.
5. Select **Deploy from a branch**, choose the default branch and `/ (root)`, then save.
6. Share the generated `github.io` URL only with `?calendar=shared&invite=YOUR_SECRET_TOKEN` appended. Do not share the plain GitHub Pages URL.

The Supabase anon key is designed to be used in browser code. Row-level security is the protection boundary; never add a service-role key to `index.html`. `Calendar.txt` is private and must never be uploaded.

## Seed existing local bookings

Use the included `seed-bookings.mjs` script to copy bookings from a JSON export into Supabase.

1. In Chrome, open the current calendar page where the bookings are visible.
2. Open **View → Developer → Developer Tools**, then choose the **Console** tab.
3. Open `export-bookings.js`, copy its entire contents, paste it into the console, and press Enter.
4. If Chrome warns about pasting code, type `allow pasting` manually first, then paste the script again.
5. Chrome downloads a `bookings.json` file. Move it into this folder.

For a manual export, this command copies the raw local data:

```js
copy(localStorage.getItem('clandar-september-2026-reservations'))
```

6. From this folder, run:

```bash
SUPABASE_URL='https://YOUR_PROJECT_REF.supabase.co' \
SUPABASE_PUBLISHABLE_KEY='sb_publishable_...' \
node seed-bookings.mjs bookings.json
```

The script inserts every booking into the `shared` calendar. It only accepts dates from 18 through 29 September 2026. Run it once; running it again creates duplicates.

## Local preview

From this folder, run:

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765/>.
