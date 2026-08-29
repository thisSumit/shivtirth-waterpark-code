-- SQL Schema for Shivtirth Waterpark Admin Panel & CMS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (For Role-Based Access)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txnid TEXT UNIQUE NOT NULL,
    gateway_txnid TEXT,
    gateway_status TEXT,
    gateway_response TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Not Paid' CHECK (payment_status IN ('Paid', 'Failed', 'Not Paid')),
    payment_status_label TEXT,
    booked_date TIMESTAMP WITH TIME ZONE NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    adult_qty INTEGER NOT NULL DEFAULT 0,
    kid1_qty INTEGER NOT NULL DEFAULT 0,
    kid2_qty INTEGER NOT NULL DEFAULT 0,
    visit_date DATE NOT NULL,
    plan_name TEXT NOT NULL,
    ticket_type TEXT NOT NULL,
    ticket_price NUMERIC NOT NULL DEFAULT 0,
    ticket_qty INTEGER NOT NULL DEFAULT 0,
    ticket_subtotal NUMERIC NOT NULL DEFAULT 0,
    addon_summary TEXT NOT NULL DEFAULT 'None',
    addon_subtotal NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'checkout-page',
    rules_accepted BOOLEAN NOT NULL DEFAULT false,
    consent_accepted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INFLUENCERS
CREATE TABLE IF NOT EXISTS public.influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    birth_date DATE NOT NULL,
    followers TEXT NOT NULL,
    profile_link TEXT NOT NULL,
    city TEXT NOT NULL,
    niche TEXT,
    message TEXT,
    accept_guidelines BOOLEAN NOT NULL DEFAULT false,
    accept_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- OFFERS
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    src TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    aspect_ratio NUMERIC NOT NULL DEFAULT 1.5,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PACKAGES
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    highlight TEXT NOT NULL DEFAULT '',
    covers JSONB NOT NULL DEFAULT '[]'::jsonb,
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    consent_text TEXT,
    ticket_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    original_price NUMERIC,
    discounted_price NUMERIC,
    tag TEXT,
    description TEXT,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    cta TEXT NOT NULL DEFAULT 'Book Now',
    link TEXT NOT NULL DEFAULT '/checkout',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'youtube')),
    src TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ATTRACTIONS
CREATE TABLE IF NOT EXISTS public.attractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    park_type TEXT NOT NULL CHECK (park_type IN ('water-park', 'amusement-park', 'adventure-park', 'boating-park')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    park_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WEBSITE CONTENT
CREATE TABLE IF NOT EXISTS public.website_content (
    section TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create helper function for RLS Admin checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid()
      AND public.profiles.role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES FOR PROFILES
CREATE POLICY select_own_profile ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY all_admin_profiles ON public.profiles FOR ALL USING (public.is_admin());

-- RLS POLICIES FOR PUBLIC READ-ONLY TABLES
-- offers, packages, gallery, attractions, activities, settings, website_content
CREATE POLICY select_public_offers ON public.offers FOR SELECT USING (true);
CREATE POLICY all_admin_offers ON public.offers FOR ALL USING (public.is_admin());

CREATE POLICY select_public_packages ON public.packages FOR SELECT USING (true);
CREATE POLICY all_admin_packages ON public.packages FOR ALL USING (public.is_admin());

CREATE POLICY select_public_gallery ON public.gallery FOR SELECT USING (true);
CREATE POLICY all_admin_gallery ON public.gallery FOR ALL USING (public.is_admin());

CREATE POLICY select_public_attractions ON public.attractions FOR SELECT USING (true);
CREATE POLICY all_admin_attractions ON public.attractions FOR ALL USING (public.is_admin());

CREATE POLICY select_public_activities ON public.activities FOR SELECT USING (true);
CREATE POLICY all_admin_activities ON public.activities FOR ALL USING (public.is_admin());

CREATE POLICY select_public_settings ON public.settings FOR SELECT USING (true);
CREATE POLICY all_admin_settings ON public.settings FOR ALL USING (public.is_admin());

CREATE POLICY select_public_website_content ON public.website_content FOR SELECT USING (true);
CREATE POLICY all_admin_website_content ON public.website_content FOR ALL USING (public.is_admin());

-- RLS POLICIES FOR SUBMISSIONS / FORM TABLES
-- contacts, influencers, bookings
CREATE POLICY insert_public_contacts ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY all_admin_contacts ON public.contacts FOR ALL USING (public.is_admin());

CREATE POLICY insert_public_influencers ON public.influencers FOR INSERT WITH CHECK (true);
CREATE POLICY all_admin_influencers ON public.influencers FOR ALL USING (public.is_admin());

-- Bookings can be inserted by public (during checkout initiate) and updated by public (during PayU callbacks, or we check bypass)
-- Actually, the PayU callback routes are API routes running on the server, they can bypass RLS via service role client (supabaseAdmin)
-- But for frontend client, allow select of own booking by email/mobile or just allow insert. Let's make it insert/select for public, full access for admin.
CREATE POLICY insert_public_bookings ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY select_public_bookings ON public.bookings FOR SELECT USING (true);
CREATE POLICY all_admin_bookings ON public.bookings FOR ALL USING (public.is_admin());

-- TRIGGER FOR AUTH SIGNUP TO CREATE PROFILE
-- Automatically creates a profile record when a user signs up via auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
