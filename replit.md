# Running this project on Replit

This project is a static HTML page. The `Start application` workflow serves it on port 5000 for the Replit preview:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

No dependency installation or environment secrets are needed to view the page. Tailwind CSS and the Inter font load from public CDNs, so styling requires internet access.

The page is a static single-page football advisory app. It has a responsive roster/content navigation, five expert profiles, ten locally seeded sample articles, category filters and live counts, an on-demand database schema modal, and an optional muted looping YouTube background video. The video is paused by default when the browser requests reduced motion; the header/menu control can pause or resume it. Tailwind CSS and the Inter font load from public CDNs.

The article data and counts are currently local to the browser; they are not persisted to Supabase. The SQL is displayed for review only and is never executed by the page. Before applying it to a Supabase project, review the row-level security policies and privileges for your use case. Never put a Supabase service-role key in this public HTML file.
