-- SEED DATA FOR SHIVTIRTH WATERPARK DATABASE
-- Execute this SQL script in your Supabase SQL Editor to populate initial default site content.

-- 0. INITIALIZE STORAGE BUCKETS & POLICIES
-- Create the assets bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Clean up existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access to assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from assets" ON storage.objects;

-- Policy to allow anyone to read assets
CREATE POLICY "Allow public read access to assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Policy to allow anyone to insert assets
CREATE POLICY "Allow public upload to assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'assets');

-- Policy to allow anyone to delete assets
CREATE POLICY "Allow public delete from assets"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'assets');

-- Ensure checked_in column exists on bookings table for gatekeeper check-in tracking
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT false;

-- CLEAN UP DUPLICATES & ADD UNIQUE CONSTRAINTS (TO PREVENT FUTURE DUPLICATION)
-- 1. Clean up duplicate entries (keeping oldest by created_at)
DELETE FROM public.attractions
WHERE id NOT IN (
    SELECT DISTINCT ON (park_type, title) id
    FROM public.attractions
    ORDER BY park_type, title, created_at ASC
);

DELETE FROM public.activities
WHERE id NOT IN (
    SELECT DISTINCT ON (park_type, title) id
    FROM public.activities
    ORDER BY park_type, title, created_at ASC
);

DELETE FROM public.gallery
WHERE id NOT IN (
    SELECT DISTINCT ON (src) id
    FROM public.gallery
    ORDER BY src, created_at ASC
);

DELETE FROM public.offers
WHERE id NOT IN (
    SELECT DISTINCT ON (src) id
    FROM public.offers
    ORDER BY src, created_at ASC
);

-- 2. Add unique constraints safely
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


-- 1. SEED DEFAULT OFFERS (CAROUSEL BANNERS ON HOME)
INSERT INTO public.offers (src, alt, aspect_ratio, display_order) VALUES
('/offers/banner4.png', 'Save 30% on Combo Packages', '1.5', 1),
('/offers/banner3.jpeg', 'Dive into the fun at Shivtirth', '1.5', 2)
ON CONFLICT (src) DO UPDATE SET
  alt = EXCLUDED.alt,
  aspect_ratio = EXCLUDED.aspect_ratio,
  display_order = EXCLUDED.display_order;

-- Ensure footer and is_hidden columns exist across CMS tables
ALTER TABLE public.packages DROP CONSTRAINT IF EXISTS packages_category_check;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS footer TEXT DEFAULT '';
ALTER TABLE public.attractions ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'water-park';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

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
  ticket_options = EXCLUDED.ticket_options,
  cta = EXCLUDED.cta,
  footer = EXCLUDED.footer;

-- 3. SEED DEFAULT GALLERY SHOWCASE
INSERT INTO public.gallery (type, src, display_order) VALUES
('image', '/o11.jpg', 1),
('image', '/air-tourism.jpg', 2),
('image', '/a4.jpg', 3),
('youtube', 'https://youtube.com/shorts/Ew8q8UF3p_s?si=avdT_x7Ah2ZWGYda', 4),
('image', '/foam-dance.jpg', 5),
('image', '/Adventure-Park.jpg', 6),
('youtube', 'https://www.youtube.com/shorts/ciOg6AOlTzE', 7),
('image', '/birdspark-1.jpg', 8),
('image', '/p1.jpeg', 9),
('video', '/ov2.MP4', 10),
('image', '/adventure.jpg', 11),
('image', '/ag4.jpg', 12)
ON CONFLICT (src) DO UPDATE SET
  type = EXCLUDED.type,
  display_order = EXCLUDED.display_order;

-- 4. SEED DEFAULT ATTRACTIONS SLIDES
INSERT INTO public.attractions (park_type, title, description, image, display_order) VALUES
('water-park', 'Adishakti Waterfall', 'Walk under a wide, scenic waterfall set against rocky structures. With a gentle flow of water and a spacious pool around it, it offers a great place to stand, play, and cool off with family and friends.', '/adishakti-waterfall.jpg', 1),
('water-park', 'Foam Dance Pool', 'Enjoy the music and light splashes of water under a cover of soft, light foam. It is a playful and engaging experience that adds a lively, celebratory touch to your visit, perfect for groups wanting to dance and enjoy together.', '/foam-dance.jpg', 2),
('water-park', 'Family Splash Pool', 'A wide and shallow pool designed for children and families to splash and play safely. Filled with mini slides and water features, it provides a comfortable and active setup where parents and kids can enjoy the water together.', '/splash-bucket.jpeg', 3),
('water-park', 'Rappelling (Upcoming)', 'Get ready to experience adventure in a whole new way. Set against a scenic waterfall backdrop, this upcoming activity blends thrill, challenge, and natural beauty-perfect for those looking to try something exciting and different.', '/rappelling.png', 4),

('adventure-park', 'Zip Line', 'Soar across the adventure zone and feel the rush of speed and height in one seamless ride. Designed for excitement and smooth movement, it offers a thrilling perspective from above while keeping the experience safe and unforgettable.', '/Adventure-Park.jpg', 1),
('adventure-park', 'Rope Bridges', 'Test your balance as you make your way across suspended paths set above the ground. With every step, enjoy a mix of light challenge and scenic views-making it a fun and engaging experience for all ages.', '/rope-bridges.jpg', 2),
('adventure-park', 'Obstacle Courses', 'Take on a series of fun challenges that put your agility, focus, and determination to the test. Each section is designed to keep you active and engaged, turning every step into an enjoyable and rewarding adventure.', '/obstacle-bridge.jpg', 3),
('adventure-park', 'Burma Bridges', 'Take on a classic outdoor challenge as you balance your way across rope-supported bridges. With guided safety and a well-designed setup, it offers an authentic adventure experience that is both engaging and rewarding.', '/burma-bridges.jpg', 4),
('adventure-park', 'Net Climbing', 'Climb secure net structures that combine physical activity and thrill for kids, youth, and adventure enthusiasts.', '/net-climbing.jpeg', 5),
('adventure-park', 'Commando Tower', 'Push your limits with a multi-activity challenge designed to build confidence and courage. With guided climbing and controlled descents under expert supervision, it offers a safe yet powerful adventure experience.', '/commando-tower.jpeg', 6),
('adventure-park', 'Target Shooting', 'Test your focus and precision in a controlled, engaging setup designed for both fun and skill-building. It is a rewarding experience that challenges your aim while keeping the activity safe and enjoyable.', '/target-shooting.jpg', 7),
('adventure-park', 'Tree House', 'A peaceful spot set amidst nature, offering elevated views and a refreshing break from the activity around. Designed as a relaxing stay point, it is the perfect place to pause, unwind, and enjoy the surroundings.', '/tree-house.jpg', 8),
('adventure-park', '3D Show', 'Discover an immersive experience set within Mogli Park, where visuals, motion, and storytelling come together in a jungle-inspired setting. It is a unique attraction that adds a different kind of excitement-perfect for taking a break while still enjoying something engaging and memorable.', '/3d-show.jpeg', 9),
('adventure-park', 'Butterfly Garden', 'A calm, nature-filled space designed for quiet moments and gentle exploration. Surrounded by greenery and vibrant butterflies, it offers a refreshing pause from the excitement-bringing balance, beauty, and relaxation to your visit.', '/butterfly-garden.jpeg', 10),

('amusement-park', 'Tora Tora Ride', 'Feel the rush of fast spins and continuous motion as the ride swings and rotates in sync. Built for high-energy fun, it delivers a lively, action-packed experience that keeps the excitement going from start to finish.', '/tora-tora.jpeg', 1),
('amusement-park', 'Columbus Ride', 'Feel the thrill as the giant ship swings higher with every motion, building excitement and anticipation. It is a perfect blend of rush and fun, delivering a classic ride experience that keeps everyone engaged till the very end.', '/columbus-ride.jpeg', 2),
('amusement-park', 'High Swing', 'Rise above the ground and feel the thrill as the swing lifts you higher with every motion. Designed to deliver a mix of height, movement, and excitement, it offers a refreshing ride experience with a touch of adventure.', '/high-swing.png', 3),
('amusement-park', 'Jumper Ride', 'Feel the excitement of quick lifts and rhythmic motion as the ride keeps you moving with energy and fun. Designed for those who enjoy lively, fast-paced experiences, it delivers a playful thrill from start to finish.', '/jumper-ride.jpg', 4),
('amusement-park', 'Kids Play Zone', 'A thoughtfully designed space where children can play, explore, and enjoy with ease. With safe mini rides and engaging activities, it offers a fun-filled environment that keeps young guests happily entertained.', '/kids-play-zone.png', 5),

('boating-park', 'Banana Boat', 'Gather your group and get ready for a ride full of energy and excitement. As the banana boat speeds across the water, every turn brings laughter, splashes, and moments you will want to relive. It is the perfect mix of thrill and togetherness-made for unforgettable group fun.', '/Boating-Park.jpg', 1),
('boating-park', 'Speed Boat', 'Experience pure adrenaline as you race across the water with powerful speed and sharp turns. Designed for thrill seekers, this ride delivers high-energy moments, exciting splashes, and a rush you will feel long after it ends.', '/speed-boat.jpg', 2),
('boating-park', 'Shikara Ride', 'Unwind with a calm and scenic ride that lets you slow down and take in the beauty around you. Gliding gently over the water, this peaceful experience offers a refreshing escape-perfect for relaxing moments with your loved ones.', '/shikara-boat.jpg', 3),
('boating-park', 'Kayak Boat', 'Enjoy a peaceful and scenic ride that lets you connect with nature. As you paddle gently across the water, take in the beauty around you and find a moment of calm in the midst of your adventure.', '/Boating-Park.jpg', 4),
('boating-park', 'Pedal Boat', 'Get a fun workout while enjoying the water with a pedal boat ride. Perfect for families and friends, it offers a leisurely pace that lets you take in the surroundings while still being part of the fun.', '/Boating-Park.jpg', 5)
ON CONFLICT (park_type, title) DO UPDATE SET
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  display_order = EXCLUDED.display_order;

-- 5. SEED DEFAULT SECONDARY PARKS & ACTIVITIES (EXPERIENCES)
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_park_type_check;

INSERT INTO public.activities (park_type, title, description, image, features, display_order) VALUES
('bird-park', 'Bird Park', 'Leave the ordinary behind and step into a lush, interactive sanctuary. Shivtirth Bird Park is more than just a habitat - it is a journey designed to bring you face-to-face with the wild. From the graceful glide of swans to the playful hops of our furry residents, discover a peaceful haven where you can experience a rare, hand-in-hand connection with nature''s most beautiful creatures.', '/Bird-Park.jpg', '["Swan Feeding", "Duck Feeding", "Guinea Fowl", "Pigeons", "Love Birds", "Roosters", "Rabbits", "Turkey", "Exotic Birds", "Sheep & More"]', 1),

('air-tourism', 'Air Tourism', 'Soar above the skies of Nagpur with breathtaking helicopter tours at Shivtirth - an adventure like no other. Take your thrill to new heights with Shivtirth Air Tourism Experience. A 25 km helicopter ride that reveals Nagpur''s breathtaking beauty from the sky.', '/air-tourism.jpg', '["25 km Panoramic Flight", "Family-Friendly Adventure", "Aerial Photography", "Bird''s-Eye City Views"]', 2),

('agro-park', 'Agro Park', 'Trade the city noise for the scent of fresh soil and endless horizons. Dive into an authentic farm life experience where tradition meets nature, offering you the ultimate soul-recharging escape amidst our lush, vibrant plantations.', '/ag4.jpg', '["Kitchen Garden", "Fruit Orchards", "Rural Games", "Traditional Equipment", "Exotic Plants", "Irrigation & Farming Techniques"]', 3),

('safari', 'Safari', 'Forget the zoo - experience the pulse-pounding heart of the wild. Our Safari Expedition takes you deep into a rugged habitat where every turn reveals a new wonder. Whether you are chasing the sunset or spotting majestic wildlife, it is a high-octane, off-road journey designed for the brave and the curious.', '/safari-1.jpg', '["Jungle Gypsy Safari", "Tractor Safari", "Train Safari (Shivapuri)", "Shivshahi Bus Safari", "Bullock Cart Safari"]', 4),

('stay-facilities', 'Stay Facilities', 'Why let the fun end at sunset? Trade the long drive home for a night under the stars. From cozy, rustic stays to premium comfort, our facilities are designed to let you recharge in the heart of nature. Wake up to the sound of birds and the fresh scent of the wild - your ultimate staycation starts here.', '/farmhouse.png', '["Farmhouse Bungalows", "Dormitory Cottages", "Camping Tents", "AC Rooms"]', 5),

('dining', 'Dining', 'Refuel your body and treat your taste buds to a culinary journey like no other. From authentic local delicacies to popular global favorites, our dining experience is the perfect break between thrills. Whether it is a quick snack to keep you going or a hearty meal with the whole family, we serve every dish with a side of spectacular views.', '/Dining-Image.jpeg', '["Family Dining", "Cafeteria", "Specialty Beverages", "Vegetarian Options", "Kids Menu", "Outdoor Seating"]', 6),

('school-and-college-picnics', 'School & College Picnics', 'Elevate the classroom to the great outdoors! We specialize in creating high-energy, perfectly organized picnic experiences that balance heart-pounding thrills with meaningful team-building. From safety-first water adventures to educational nature trails, we provide a secure environment where students can bond, learn, and create stories that will last a lifetime.', '/s1.jpg', '["School Trips", "College Picnics", "Group Activities", "Educational Tours", "Safe Supervision"]', 7),

('birthday-parties', 'Birthday Parties', 'Why settle for a room when you can have a whole park? Turn your special day into a legendary celebration where every moment is a thrill. From high-energy water splashes to vibrant outdoor setups, we create the ultimate party atmosphere that blends adventure with celebration. Whether it is your 10th or your 25th, we bring the vibes, the cake, and the non-stop fun!', '/birthday-1.jpg', '["Theme Decorations", "Fun Activities", "Custom Cakes", "Music & Entertainment", "Group Packages"]', 8),

('wedding-celebrations', 'Wedding Celebrations', 'Exchange your vows where the horizon meets the water. From breathtaking lakeside views to lush garden ceremonies, we transform your "I Do" into a grand, multi-sensory experience. Whether it is a vibrant Haldi by the pool or a starlit reception in the wild, our dedicated team handles every detail so you can focus on the magic of the moment.', '/wedding-1.jpg', '["Wedding Functions", "Receptions", "Pre-wedding Shoots", "Birthday Events", "Anniversaries", "Festival Celebrations"]', 9),

('corporate-events', 'Corporate Events', 'Break the boardroom walls and ignite your team''s potential in a landscape designed for high-impact engagement. From high-energy team-building challenges to sophisticated open-air conferences, we provide a seamless blend of professional excellence and adventurous spirit. Whether it is a strategy retreat or an annual celebration, we deliver the perfect environment to recharge, reconnect, and hit your next milestone.', '/corperate.webp', '["Team Outings", "Corporate Parties", "Workshops", "Team Building Activities", "Conference Setup"]', 10),

('festive-celebrations', 'Festive Celebrations', 'Do not just mark the calendar - live the moment. From the high-energy colors of Holi to the sparkling magic of Diwali, we transform traditional festivals into immersive, larger-than-life experiences. Feel the pulse of the music, the warmth of the community, and the thrill of the park all coming together in one vibrant explosion of joy. Whether it is a family gathering or a massive public event, we bring the soul to your celebrations.', '/festival-celebration.jpeg', '["Holi Celebration", "Festival Events", "Live Entertainment", "Special Decorations", "Seasonal Activities", "Group Celebrations"]', 11),

('custom-event-planning', 'Event Planning', 'Stop searching for the perfect venue and start creating it. Whether it is a bespoke private gala, a niche themed festival, or a one-of-a-kind milestone celebration, our dedicated planning team turns your wildest ideas into a seamless reality. From the first sketch to the final firework, we customize every detail - decor, dining, and thrills - to reflect your unique story in a setting that defies the ordinary.', '/custom-events.png', '["Custom Themes", "Event Setup", "Entertainment Planning", "Food Arrangements", "End-to-End Management"]', 12),

('stay-facilities', 'Farmhouse Bungalows', 'Spacious private farmhouse with lush green garden lawns, AC bedrooms, living room, and exclusive sit-out area. Ideal for family reunions, group parties, and private gatherings looking for an exclusive getaway.', '/farmhouse.png', '["AC Bedrooms with Attached Bath", "Private Lawn & Garden Sit-out", "Spacious Living Hall", "24/7 Hot Water & Power Backup", "Water Park & Pool Access"]', 13),

('stay-facilities', 'Camping Tents Experience', 'Immerse yourself in authentic outdoors! Premium waterproof camping tents under starry skies with evening bonfire, ambient music, and next morning breakfast surrounded by nature.', '/Stay-Facilities.jpg', '["Waterproof Tents with Bedding", "Evening Campfire & Music Setup", "Complimentary Morning Breakfast", "Access to Agro & Bird Park", "Safe & Secured Camping Grounds"]', 14),

('stay-facilities', 'Dormitory Cottages', 'Comfortable dormitory style air-cooled cottages designed for student picnics, large family groups, and corporate team outings looking for value and togetherness.', '/ag4.jpg', '["Multiple Beds with Clean Linen", "Clean Shared Washrooms", "Personal Storage Lockers", "Close to Dining Arena", "Group Discount Packages"]', 15),

('stay-facilities', 'Deluxe AC Rooms', 'Modern deluxe air-conditioned rooms equipped with plush king beds, flat-screen TV, room service, and tranquil views of surrounding plantations for ultimate comfort.', '/g10.png', '["King Size Plush Mattress", "Split Air Conditioning", "Flat Screen TV & WiFi Access", "Complimentary Tea/Coffee Maker", "24/7 Housekeeping Service"]', 16)
ON CONFLICT (park_type, title) DO UPDATE SET
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order;

-- Clean up deprecated GST setting
DELETE FROM public.settings WHERE key = 'ticket_gst_percentage';

-- 6. SEED DEFAULT SETTINGS
INSERT INTO public.settings (key, value) VALUES
('whatsapp_number', '"+919876543210"'),
('contact_phone', '"+91 99999 88888"'),
('contact_email', '"support@shivtirth.com"'),
('booking_cutoff_hours', '12')
ON CONFLICT (key) DO NOTHING;

-- 7. SEED DEFAULT GENERAL WEBSITE CONTENT
INSERT INTO public.website_content (section, content) VALUES
('hero', '{"title": "Nagpur’s Ultimate Fun Destination", "description": "Get ready for non-stop excitement at Shivtirth Water Park, packed with thrilling rides, scenic spaces, and endless entertainment.", "buttonText": "Book Tickets", "videoUrl": "/ov2.MP4", "bgImageUrl": "/waterpark-1.jpg"}'),
('popup', '{"title": "Grab Your Tickets Now & Dive Into the Fun!", "description": "Exclusive packages with up to 30% discount!", "imageUrl": "/offers/banner3.jpeg"}')
ON CONFLICT (section) DO NOTHING;
