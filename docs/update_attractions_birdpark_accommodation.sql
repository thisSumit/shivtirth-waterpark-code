-- ==============================================================================
-- Migration script to add Bird Park, Accommodation & School Picnic support to attractions table
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Drop existing restrictive CHECK constraint on public.attractions park_type if present
ALTER TABLE public.attractions DROP CONSTRAINT IF EXISTS attractions_park_type_check;

-- 2. Add updated CHECK constraint including bird-park, accommodation, and school-picnic
ALTER TABLE public.attractions ADD CONSTRAINT attractions_park_type_check 
CHECK (park_type IN ('water-park', 'amusement-park', 'adventure-park', 'boating-park', 'bird-park', 'accommodation', 'school-picnic'));

-- 3. Ensure unique constraint for (park_type, title) to avoid duplication on re-run
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'attractions_park_type_title_key') THEN
        ALTER TABLE public.attractions ADD CONSTRAINT attractions_park_type_title_key UNIQUE (park_type, title);
    END IF;
END;
$$;

-- 4. Add video and video_url columns to attractions table if not already present
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS video TEXT;
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 4. Seed default Attraction Cards for Bird Park, Accommodation & Stay, and School Picnic
INSERT INTO public.attractions (park_type, title, description, image, display_order) VALUES
-- Bird Park Attractions
('bird-park', 'Guineafowls & Turkey', 'Observe active, colourful guineafowls and majestic turkeys in an open natural habitat.', '/birdspark-1.jpg', 1),
('bird-park', 'Lovebirds & Exotic Pigeons', 'Interactive aviary setup showcasing vibrant lovebirds, fantail pigeons, and exotic species.', '/Bird-Park.jpg', 2),
('bird-park', 'Mallard & Country Ducks', 'Watch friendly duck ponds featuring Mallard ducks and country ducks splashing in natural water streams.', '/Bird-Park.jpg', 3),
('bird-park', 'Rabbits & Farm Animals', 'Gentle, hands-on learning zone with adorable rabbits and farm animals for kids.', '/Bird-Park.jpg', 4),

-- Accommodation & Stay Attractions
('accommodation', 'Farmhouse Bungalows', 'Spacious private farmhouse with lush green garden lawns, AC bedrooms, living room, and exclusive sit-out area. Ideal for family reunions, group parties, and private gatherings looking for an exclusive getaway.', '/farmhouse.png', 1),
('accommodation', 'Camping Tents Experience', 'Immerse yourself in authentic outdoors! Premium waterproof camping tents under starry skies with evening bonfire, ambient music, and next morning breakfast surrounded by nature.', '/Stay-Facilities.jpg', 2),
('accommodation', 'Dormitory Cottages', 'Comfortable dormitory style air-cooled cottages designed for student picnics, large family groups, and corporate team outings looking for value and togetherness.', '/ag4.jpg', 3),
('accommodation', 'Deluxe AC Rooms', 'Modern deluxe air-conditioned rooms equipped with plush king beds, flat-screen TV, room service, and tranquil views of surrounding plantations for ultimate comfort.', '/g10.png', 4),

-- School Picnic Attractions
('school-picnic', 'Water Park & Adishakti Water Fall', 'A fun-filled water experience designed for students with exciting slides, splash zones, rain dance, foam dance and the iconic Adishakti Water Fall.', '/Water-Park.jpg', 1),
('school-picnic', 'Mowgli Adventure Park', 'An exciting outdoor adventure zone featuring zip lines, rope bridges, obstacle courses, trekking, tree houses and team-building activities.', '/mowgli-adventure.jpg', 2),
('school-picnic', 'Baliraja Agro & Bird Park', 'An interactive learning experience where students explore agriculture, nature, plants, birds, farming activities and the surrounding ecosystem.', '/ag4.jpg', 3),
('school-picnic', 'Amusement Park & Boating', 'Enjoy exciting amusement rides along with optional boating experiences including speed boats, shikara, dragon boats, kayaks and pedal boats.', '/amusement.jpg', 4)
ON CONFLICT (park_type, title) DO UPDATE SET
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order;
