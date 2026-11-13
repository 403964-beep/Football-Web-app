# Running this project on Replit

This project is a static HTML page. The `Start application` workflow serves it on port 5000 for the Replit preview:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

No dependency installation or environment secrets are needed to view the page. Tailwind CSS and the Supabase browser library load from public CDNs, so viewing it requires internet access.

The imported page is a Phase 1 prototype: it displays database setup SQL and an architecture status panel. The Sign In / Register button currently only displays an alert; authentication and database-backed screens are not implemented.

The page includes placeholder Supabase project settings. The client stays disabled while these placeholders are present, avoiding requests to a nonexistent project. Future database work requires a real Supabase project, applying the displayed SQL after review, and implementing the missing user flows. Never put a Supabase service-role key in this public HTML file.
