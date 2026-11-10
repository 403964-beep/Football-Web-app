-- Phase 1: Supabase Database Migration Script (v12.0)

-- 1. Experts Table (Primary Key: TEXT to support natural 'expert-01' IDs)
CREATE TABLE IF NOT EXISTS public.experts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    bio TEXT NOT NULL,
    badge_color TEXT NOT NULL
);

-- 2. Users Table (Synced 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id TEXT NOT NULL REFERENCES public.experts(id),
    author_id UUID NOT NULL,
    title TEXT NOT NULL CHECK (length(title) >= 3),
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    full_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookmarks & Submitted Queries
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

CREATE TABLE IF NOT EXISTS public.submitted_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row-Level Security (RLS) Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public articles read access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Users insert own articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users update own articles" ON public.articles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users delete own articles" ON public.articles FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.submitted_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert/read own queries" ON public.submitted_queries FOR ALL USING (auth.uid() = user_id);
