-- ==============================================================================
-- SHIVTIRTH WATERPARK & RESORT - COMPLETE DATABASE SCHEMA & MIGRATION SCRIPT
-- Copy and execute this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- Safe to re-run multiple times without data loss or policy duplicate errors.
-- ==============================================================================

-- 0. INITIALIZE STORAGE BUCKET & RLS POLICIES
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read access to assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from assets" ON storage.objects;

CREATE POLICY "Allow public read access to assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'assets');
CREATE POLICY "Allow public upload to assets" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'assets');
CREATE POLICY "Allow public delete from assets" ON storage.objects FOR DELETE TO public USING (bucket_id = 'assets');

-- 1. EXTENSIONS & SCHEMA TABLE CREATION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txnid TEXT UNIQUE NOT NULL,
    gateway_txnid TEXT,
    gateway_status TEXT,
    gateway_response TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Not Paid',
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
    checked_in BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INFLUENCERS TABLE
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

-- OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    src TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    aspect_ratio NUMERIC NOT NULL DEFAULT 1.5,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PACKAGES TABLE
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
    is_hidden BOOLEAN DEFAULT false,
    footer TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    src TEXT NOT NULL,
    category TEXT DEFAULT 'water-park',
    title TEXT DEFAULT '',
    is_hidden BOOLEAN DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ATTRACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.attractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    park_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    video TEXT,
    video_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    park_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WEBSITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.website_content (
    section TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENSURE COLUMNS & CONSTRAINTS UP TO DATE
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false;

ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS video TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

ALTER TABLE public.packages DROP CONSTRAINT IF EXISTS packages_category_check;
ALTER TABLE public.attractions DROP CONSTRAINT IF EXISTS attractions_park_type_check;
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_park_type_check;

ALTER TABLE public.attractions ADD CONSTRAINT attractions_park_type_check 
CHECK (park_type IN ('water-park', 'amusement-park', 'adventure-park', 'boating-park', 'bird-park', 'accommodation', 'school-picnic'));

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'attractions_park_type_title_key') THEN
        ALTER TABLE public.attractions ADD CONSTRAINT attractions_park_type_title_key UNIQUE (park_type, title);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activities_park_type_title_key') THEN
        ALTER TABLE public.activities ADD CONSTRAINT activities_park_type_title_key UNIQUE (park_type, title);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gallery_src_key') THEN
        ALTER TABLE public.gallery ADD CONSTRAINT gallery_src_key UNIQUE (src);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'offers_src_key') THEN
        ALTER TABLE public.offers ADD CONSTRAINT offers_src_key UNIQUE (src);
    END IF;
END;
$$;

-- 3. SEED DEFAULT PACKAGES & OFFERS
INSERT INTO public.packages (plan_id, category, name, image, original_price, discounted_price, tag, description, inclusions, display_order, highlight, covers, rules, consent_text, ticket_options, cta, footer) VALUES
('waterpark-package', 'package', 'Water Park Package', '/waterpark-1.jpg', 790, 590, 'Most Popular', 'Complete water park experience with adventure activities', '["Waterpark access", "Adventure park & 3d show", "Amusement park", "Safari experience", "Agro activities"]', 1, 'Best Choice for Friends & Family', '["Waterfall access", "Adventure zone rides", "Splash pools access"]', '["Nylon swimwear mandatory"]', 'I agree to the park safety guidelines and rules.', '[{"id":"regular","label":"Entry Ticket","price":590}]', 'Book Water Park', 'Per person pricing'),
('boating-package', 'package', 'Boating Package', '/Boating-Park.jpg', 1000, 690, NULL, 'Unlimited boating fun with exciting ride options', '["Banana, Speed & Disco Boat", "Shikara, Kayak & Paddle Boat", "Dragon, Train & Sofa Boat", "Octopus Ride", "Zorbing Ball"]', 2, 'Vidarbha''s Biggest Boating Park', '["7 Types of Boat Rides", "Lakeside views"]', '["Life jacket mandatory"]', 'I agree to follow lifeguard instructions.', '[{"id":"regular","label":"Entry Ticket","price":690}]', 'Book Boating', 'Per person pricing'),
('silver-combo', 'package', 'Silver Combo Package', '/g8.png', 1280, 890, 'Best Value', 'Waterpark Package + Boating Park Package Activities - The perfect combo for thrill seekers', '["All Water Park activities", "All Boating rides (7 rides)", "Full day access"]', 3, 'Combo Pass Special Offer', '["Waterpark entry", "Boating park access", "Unlimited rides"]', '["Follow all ride safety guidelines"]', 'I accept all combo terms and conditions.', '[{"id":"regular","label":"Entry Ticket","price":890}]', 'Book Silver Combo', 'Per person pricing'),
('golden-package', 'package', 'Golden Full Package', '/g10.png', 1630, 1190, 'Premium', 'Complete experience with food - Perfect for families', '["Waterpark access", "Boating rides", "Breakfast included", "Lunch included", "Evening snacks"]', 4, 'Full Day Experience with Meals', '["Meals Included", "All Rides", "Reserved tables"]', '["Food coupons non-refundable"]', 'I agree to follow dining schedules and rules.', '[{"id":"regular","label":"Entry Ticket","price":1190}]', 'Book Golden Package', 'Per person pricing'),
('stay-package', 'accommodation', 'Day & Night Package', '/Stay-Facilities.jpg', 3000, 2500, 'Ultimate Stay', 'Extended stay with overnight camping experience & farmhouse stay options', '["Waterpark + Boating", "Stay Facilities- Camping stay / Farm House", "2 Meals included", "Bonfire & activities", "Breakfast next day"]', 5, 'Overnight Stay & Adventure Combo', '["Camping Tent", "Bonfire access", "Next day breakfast"]', '["No check-in without valid ID proof"]', 'I agree to the stay rules and campsite guidelines.', '[{"id":"regular","label":"Entry Ticket","price":2500}]', 'Book Stay Package', 'Per person / night pricing'),
('monsoon-picninic-hungama', 'offer', 'Monsoon Picnic Hungama', '/offers/banner4.png', 620, 590, 'Monsoon Special', '🎟️ Waterpark + Amusement + Adventure (3 Parks = 1 Ticket)', '["Waterpark access", "Adventure park", "Amusement park", "Safari", "Agro activities"]', 6, '🎉 MONSOON PICNIC, HUNGAMA SHURU', '["Waterpark entry", "Adventure park access"]', '["Valid on selected dates"]', NULL, '[{"id":"regular","label":"Per Person","price":590}]', '👉 Book Monsoon Picnic', '⏳ Limited Period Special'),
('ladki-bahin-special', 'offer', 'Ladki Bahin Special Offer', '/offers/banner3.jpeg', 790, 550, 'Ladies Special', '💰 ₹790 → ₹690 (Single Entry) | Group: Just ₹550 per person', '["Waterpark", "Amusement", "Adventure"]', 7, 'Ladies Only Entry Offer', '["Waterpark entry", "Amusement rides"]', '["Ladies only entry offer"]', 'I confirm this booking is for ladies only entry.', '[{"id":"single","label":"Single Entry","price":690},{"id":"group","label":"Group Entry","price":550}]', '👉 Book Ladies Offer', '💝 Group Offer: ₹550 per person')
ON CONFLICT (plan_id) DO UPDATE SET
  category = EXCLUDED.category,
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  original_price = EXCLUDED.original_price,
  discounted_price = EXCLUDED.discounted_price,
  tag = EXCLUDED.tag,
  description = EXCLUDED.description,
  inclusions = EXCLUDED.inclusions,
  display_order = EXCLUDED.display_order,
  highlight = EXCLUDED.highlight,
  covers = EXCLUDED.covers,
  rules = EXCLUDED.rules,
  consent_text = EXCLUDED.consent_text,
  cta = EXCLUDED.cta,
  footer = EXCLUDED.footer;

-- 4. SEED DEFAULT ATTRACTIONS SLIDES & MEDIA CARDS
INSERT INTO public.attractions (park_type, title, description, image, video, video_url, display_order) VALUES
-- WATER PARK ATTRACTIONS
('water-park', 'Adishakti Waterfall', 'Scenic cascading waterfall pool perfect for cooling off and splashing with family.', '/adishakti-waterfall.jpg', NULL, NULL, 1),
('water-park', 'Multiplay Station', 'Interactive aquatic play structure with mini slides, water buckets, and splash features.', '/splash-bucket.jpeg', NULL, NULL, 2),
('water-park', 'Rain Dance (Light Effect)', 'Groove to party beats under synchronized water jets enhanced with dynamic light effects.', '/foam-dance.jpg', NULL, NULL, 3),
('water-park', 'Foam Dance (Fog, Smoke)', 'High-energy dance floor filled with soft foam, fog, and smoke effects for group fun.', '/foam-dance.jpg', NULL, NULL, 4),

-- BOATING PARK ATTRACTIONS
('boating-park', 'Banana Boat', 'Thrilling group ride pulled across the water for high-energy turns and splashes.', '/Boating-Park.jpg', NULL, NULL, 1),
('boating-park', 'Octopus Boat', 'Unique multi-seat water ride offering exciting spins and water movement.', '/Boating-Park.jpg', NULL, NULL, 2),
('boating-park', 'Disco Boat', 'Fun circular boat ride featuring music vibes and spinning water action.', '/Boating-Park.jpg', NULL, NULL, 3),
('boating-park', 'Boat House', 'Relaxing floating house setup ideal for scenic views and peaceful leisure time.', '/Boating-Park.jpg', NULL, NULL, 4),
('boating-park', 'Speed Boat', 'High-speed motorboat ride delivering pure adrenaline and sharp turns across open water.', '/speed-boat.jpg', NULL, NULL, 5),
('boating-park', 'Dragon Boat', 'Theme-designed group rowing and motorboat experience for family outings.', '/Boating-Park.jpg', NULL, NULL, 6),
('boating-park', 'Shikara Boat', 'Tranquil traditional-style boat glide across calm waters for relaxation.', '/shikara-boat.jpg', NULL, NULL, 7),

-- ADVENTURE PARK ATTRACTIONS
('adventure-park', 'Zip Line', 'High-flying cable ride offering aerial speed and panoramic views across the park.', '/Adventure-Park.jpg', NULL, NULL, 1),
('adventure-park', 'Rope Bridges', 'Suspended balance paths designed to test coordination over elevated height.', '/rope-bridges.jpg', NULL, NULL, 2),
('adventure-park', 'Burma Bridges', 'Classic three-rope adventure bridge crossing with safety harness support.', '/burma-bridges.jpg', NULL, NULL, 3),
('adventure-park', 'Target Shooting', 'Precision shooting gallery setup to test focus and aim in a controlled environment.', '/target-shooting.jpg', NULL, NULL, 4),
('adventure-park', '3D Show', 'Immersive motion theater experience featuring visual effects and storytelling.', '/3d-show.jpeg', NULL, NULL, 5),

-- AMUSEMENT PARK ATTRACTIONS
('amusement-park', 'Columbus', 'Classic giant swinging ship ride delivering thrilling weightless drops.', '/columbus-ride.jpeg', NULL, NULL, 1),
('amusement-park', 'Tora Tora Ride', 'Fast-spinning high-energy attraction featuring rotational motion and thrill.', '/tora-tora.jpeg', NULL, NULL, 2),
('amusement-park', 'Break Dance', 'Revolving platform ride with freely spinning cars moving to upbeat music.', '/tora-tora.jpeg', NULL, NULL, 3),
('amusement-park', 'High Swing', 'Tall soaring swing ride taking riders high above ground level.', '/high-swing.png', NULL, NULL, 4),

-- BIRD PARK ATTRACTIONS
('bird-park', 'Guineafowls & Turkey', 'Observe active, colourful guineafowls and majestic turkeys in an open natural habitat.', '/birdspark-1.jpg', NULL, NULL, 1),
('bird-park', 'Lovebirds & Exotic Pigeons', 'Interactive aviary setup showcasing vibrant lovebirds, fantail pigeons, and exotic species.', '/Bird-Park.jpg', NULL, NULL, 2),
('bird-park', 'Mallard & Country Ducks', 'Watch friendly duck ponds featuring Mallard ducks and country ducks splashing in natural water streams.', '/Bird-Park.jpg', NULL, NULL, 3),
('bird-park', 'Rabbits & Farm Animals', 'Gentle, hands-on learning zone with adorable rabbits and farm animals for kids.', '/Bird-Park.jpg', NULL, NULL, 4),

-- ACCOMMODATION ATTRACTIONS
('accommodation', 'Farmhouse Bungalows', 'Spacious private farmhouse with lush green garden lawns, AC bedrooms, living room, and exclusive sit-out area.', '/farmhouse.png', NULL, NULL, 1),
('accommodation', 'Camping Tents Experience', 'Immerse yourself in authentic outdoors! Premium waterproof camping tents under starry skies with evening bonfire.', '/Stay-Facilities.jpg', NULL, NULL, 2),
('accommodation', 'Dormitory Cottages', 'Comfortable dormitory style air-cooled cottages designed for student picnics, large family groups, and corporate team outings.', '/ag4.jpg', NULL, NULL, 3),
('accommodation', 'Deluxe AC Rooms', 'Modern deluxe air-conditioned rooms equipped with plush king beds, flat-screen TV, room service, and tranquil views.', '/g10.png', NULL, NULL, 4),

-- SCHOOL PICNIC ATTRACTIONS
('school-picnic', 'Water Park & Adishakti Water Fall', 'A fun-filled water experience designed for students with exciting slides, splash zones, rain dance, foam dance and waterfall.', '/Water-Park.jpg', NULL, NULL, 1),
('school-picnic', 'Mowgli Adventure Park', 'An exciting outdoor adventure zone featuring zip lines, rope bridges, obstacle courses, trekking, tree houses.', '/mowgli-adventure.jpg', NULL, NULL, 2),
('school-picnic', 'Baliraja Agro & Bird Park', 'An interactive learning experience where students explore agriculture, nature, plants, birds, farming activities.', '/ag4.jpg', NULL, NULL, 3),
('school-picnic', 'Amusement Park & Boating', 'Enjoy exciting amusement rides along with optional boating experiences including speed boats, shikara, dragon boats.', '/amusement.jpg', NULL, NULL, 4)
ON CONFLICT (park_type, title) DO UPDATE SET
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order;

-- 5. SEED DEFAULT SETTINGS
INSERT INTO public.settings (key, value) VALUES
('whatsapp_number', '"+91 82757 37579"'),
('contact_phone', '"+91 86053 62212"'),
('contact_phone_2', '"+91 82757 37579"'),
('contact_email', '"shivtirthtourism@gmail.com"'),
('meal_full_price', '"300"'),
('meal_lunch_price', '"200"'),
('booking_cutoff_hours', '"0"')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

-- 6. ENABLE RLS POLICIES SAFELY
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

-- Helper Admin function
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

-- DROP AND RE-CREATE ALL RLS POLICIES (PREVENTS 42710 DUPLICATE POLICY ERRORS)
DROP POLICY IF EXISTS select_own_profile ON public.profiles;
CREATE POLICY select_own_profile ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS all_admin_profiles ON public.profiles;
CREATE POLICY all_admin_profiles ON public.profiles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_offers ON public.offers;
CREATE POLICY select_public_offers ON public.offers FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_offers ON public.offers;
CREATE POLICY all_admin_offers ON public.offers FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_packages ON public.packages;
CREATE POLICY select_public_packages ON public.packages FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_packages ON public.packages;
CREATE POLICY all_admin_packages ON public.packages FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_gallery ON public.gallery;
CREATE POLICY select_public_gallery ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_gallery ON public.gallery;
CREATE POLICY all_admin_gallery ON public.gallery FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_attractions ON public.attractions;
CREATE POLICY select_public_attractions ON public.attractions FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_attractions ON public.attractions;
CREATE POLICY all_admin_attractions ON public.attractions FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_activities ON public.activities;
CREATE POLICY select_public_activities ON public.activities FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_activities ON public.activities;
CREATE POLICY all_admin_activities ON public.activities FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_settings ON public.settings;
CREATE POLICY select_public_settings ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_settings ON public.settings;
CREATE POLICY all_admin_settings ON public.settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS select_public_website_content ON public.website_content;
CREATE POLICY select_public_website_content ON public.website_content FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_website_content ON public.website_content;
CREATE POLICY all_admin_website_content ON public.website_content FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS insert_public_contacts ON public.contacts;
CREATE POLICY insert_public_contacts ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS all_admin_contacts ON public.contacts;
CREATE POLICY all_admin_contacts ON public.contacts FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS insert_public_influencers ON public.influencers;
CREATE POLICY insert_public_influencers ON public.influencers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS all_admin_influencers ON public.influencers;
CREATE POLICY all_admin_influencers ON public.influencers FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS insert_public_bookings ON public.bookings;
CREATE POLICY insert_public_bookings ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS select_public_bookings ON public.bookings;
CREATE POLICY select_public_bookings ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS all_admin_bookings ON public.bookings;
CREATE POLICY all_admin_bookings ON public.bookings FOR ALL USING (public.is_admin());

-- USER REGISTRATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
