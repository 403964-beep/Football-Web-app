# Running this project on Replit

This project is a static HTML page. The `Start application` workflow serves it on port 5000 for the Replit preview:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

The page includes placeholder Supabase project settings. Sign-in and database features require a real Supabase project and are not configured by the preview server.
