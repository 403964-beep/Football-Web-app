# Running this project on Replit

This project is a static HTML page. The `Start application` workflow serves it on port 5000 for the Replit preview:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

No dependency installation or environment secrets are needed to view the page. Tailwind CSS and the Inter font load from public CDNs, so styling requires internet access.

The page is a Phase 1 dashboard prototype with a local expert roster, a SQL schema preview, a setup status console, and a clearly labeled local demo session. It does not implement real authentication or database-backed screens. Its connection check reports that Supabase is unconfigured; it does not make a network request or claim a successful connection.

The SQL is displayed for review only and is never executed by the page. Before applying it to a Supabase project, review the row-level security policies and privileges for your use case. Future database work requires configuring a real Supabase project and implementing the missing user flows. Never put a Supabase service-role key in this public HTML file.
