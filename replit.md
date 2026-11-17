# Running this project on Replit

The Flock Forecast uses a Vite-served HTML/React client with an Express server. The `Start application` workflow runs the app on port 5000:

```sh
npm run dev
```

Sign-in, sign-up, and sign-out use Replit-managed Clerk. Development and production accounts are separate. Tailwind CSS and the Inter font load from public CDNs, so styling requires internet access.

The football advisory page has a responsive roster/content navigation, five expert profiles, ten locally seeded sample articles, category filters and live counts, an on-demand database schema modal, and a YouTube background player configured to suppress captions. If YouTube blocks embedding, the player falls back to the video's thumbnail and a direct YouTube link.

The article data and counts are currently local to the browser; they are not persisted to Supabase. The SQL is displayed for review only and is never executed by the page. Before applying it to a Supabase project, review the row-level security policies and privileges for your use case. Never put a Supabase service-role key in this public HTML file.
