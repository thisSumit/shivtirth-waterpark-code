"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getWhatsAppBookingHref } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';

export const getParkSectionId = (name: string) => {
  return (name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const defaultParksDropdownItems = [
  { name: 'Bird Park', id: getParkSectionId('Bird Park') },
  { name: 'Agro Park', id: getParkSectionId('Agro Park') },
  { name: 'Air Tourism', id: getParkSectionId('Air Tourism') },
  // { name: 'Safari', id: getParkSectionId('Safari') },
  { name: 'Accommodation', id: getParkSectionId('Stay Facilities') },
  { name: 'Wedding Celebrations', id: getParkSectionId('Wedding Celebrations') },
  { name: 'Dining', id: getParkSectionId('Dining') },
  { name: 'Corporate Events', id: getParkSectionId('Corporate Events') },
  { name: 'Birthday Parties', id: getParkSectionId('Birthday Parties') },
  // { name: 'School & College Picnics', id: getParkSectionId('School & College Picnics') },
  { name: 'Festive Celebrations', id: getParkSectionId('Festive Celebrations') },
  { name: 'Event Planning', id: getParkSectionId('Event Planning') },
];

const Navbar = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileDropdownOpen(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [activitiesList, setActivitiesList] = useState(defaultParksDropdownItems);

  useEffect(() => {
    async function loadActivities() {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('id, title, park_type, is_hidden')
          .eq('is_hidden', false)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((act) => ({
            name: act.title,
            id: getParkSectionId(act.title),
          }));
          setActivitiesList(mapped);
        }
      } catch (err) {
        console.error('Error loading navbar activities:', err);
      }
    }

    loadActivities();
  }, []);

  const parkDetailDropdownItems = (parkPath: string) => [
    { name: 'About Park', href: `${parkPath}#about-park` },
    { name: 'Timing', href: `${parkPath}#timings` },
    { name: 'Rules & Regulation', href: `${parkPath}#rules-regulations` },
  ];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'WaterPark', href: '/water-park' },
    { name: 'Boating Park', href: '/boating-park' },
    { name: 'Adventure Park', href: '/adventure-park' },
    { name: 'Amusement Park', href: '/amusement-park' },
    { name: 'School Picnic', href: '/school-picnic' },
    // { name: 'Accommodation', href: '/accommodation' },
    // { name: 'Packages', href: '/packages' },
    { name: 'Offers & Packages', href: '/offers' },
    // { name: 'Gallery', href: '/gallery' },
    { name: 'Gallery', href: 'https://www.instagram.com/shivtirthbestwaterpark/' },
    { name: 'Other Activities/Parks', href: '/parks-experiences', hasDropdown: true },
    {
      name: 'Other Links',
      dropdownItems: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Accommodation', href: '/accommodation' },
        { name: 'Influencer Collaboration', href: '/influencer-collab' },
      ],
    },
  ];

  const scrollingMessages = [
    'मध्य भारत का एक मात्र वॉटर पार्क',
    'विदर्भ का सबसे बडा पिकनिक स्पॉट',
    'All Enjoyments Under One Roof',
    'ऊँचे लोग , उँची पसंद ...',
    'मध्य भारत का एक मात्र वॉटर पार्क',
    'विदर्भ का सबसे बडा पिकनिक स्पॉट',
    'All Enjoyments Under One Roof',
    'ऊँचे लोग , उँची पसंद ...',
    // 'भूल न जाना,  शिवतीर्थ आना',
    // 'सारे तिरथ एक बार, शिवतीर्थ बार बार',
  ];

  // 🔥 Smooth scroll handler
  const handleScrollToSection = (id: string) => {
    router.push('/parks-experiences');

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      {/* Scrolling Banner */}
      <div className="fixed top-0 left-0 right-0 z-9999 bg-accent text-black py-2 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...scrollingMessages, ...scrollingMessages].map((message, index) => (
            <span key={index} className="inline-flex items-center mx-6 text-sm font-semibold">
              <span className="mr-2">✨</span>
              {message}
              <span className="ml-2">✨</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-8 left-0 right-0 z-999 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-8xl mx-auto px-2 xl:px-4">
          <div className="relative z-200 flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="shrink-0 px-1 xl:px-2">
              <Image src="/logo.png" alt="Shivtirth Water Park" width={160} height={50} className="h-12 xl:h-14 w-auto" priority />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center whitespace-nowrap">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.href ? (
                    <Link
                      href={link.href}
                      className={`shrink-0 whitespace-nowrap text-[11px] xl:text-[12.5px] font-bold uppercase tracking-tight flex items-center px-1 xl:px-2 py-1 rounded-md transition ${scrolled ? 'text-slate-800' : 'text-white'} hover:text-accent hover:bg-accent/10`}
                    >
                      {link.name}
                      {(link.hasDropdown || link.dropdownItems) && <ChevronDown className="w-3.5 h-3.5" />}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`shrink-0 whitespace-nowrap text-[11px] xl:text-[12.5px] font-bold uppercase tracking-tight flex items-center gap-0.5 xl:gap-1 px-1.5 xl:px-2.5 py-1 rounded-md transition ${scrolled ? 'text-slate-800' : 'text-white'} hover:text-accent hover:bg-accent/10`}
                    >
                      {link.name}
                      {(link.hasDropdown || link.dropdownItems) && <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <div className="absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 max-h-80 overflow-y-auto border border-slate-100">
                      {activitiesList.map((item, idx) => (
                        <button
                          key={`${item.id}-${idx}`}
                          onClick={() => handleScrollToSection(item.id)}
                          className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-accent/20 hover:text-black transition"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {link.dropdownItems && (
                    <div className="absolute left-0 mt-0 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 border border-slate-100">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-accent/20 hover:text-black transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <InteractiveHoverButton
              href={"/offers"}
              className="hidden xl:block shrink-0"
            >
              Book Now
            </InteractiveHoverButton>

            {/* Mobile Toggle */}
            <button
              onClick={() => (isOpen ? closeMobileMenu() : setIsOpen(true))}
              className={`lg:hidden relative z-200 p-2 text-4xl transition ${isOpen || scrolled ? 'text-black' : 'text-white'}`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-28 left-0 right-0 bottom-0 bg-white z-100 overflow-y-auto transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                
                <button
                  onClick={() => {
                    if (link.hasDropdown || link.dropdownItems) {
                      setMobileDropdownOpen((prev) => (prev === link.name ? null : link.name));
                    } else {
                      router.push(link.href); // ✅ FIXED
                      closeMobileMenu();
                    }
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex justify-between"
                >
                  {link.name}
                  {(link.hasDropdown || link.dropdownItems) && (mobileDropdownOpen === link.name ? <ChevronUp /> : <ChevronDown />)}
                </button>

                {/* Dropdown Mobile */}
                {link.hasDropdown && mobileDropdownOpen === link.name && (
                  <div className="pl-6 space-y-1">
                    {activitiesList.map((item, idx) => (
                      <button
                        key={`${item.id}-${idx}`}
                        onClick={() => {
                          handleScrollToSection(item.id);
                          closeMobileMenu();
                        }}
                        className="block w-full text-left py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 hover:text-black"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}

                {link.dropdownItems && mobileDropdownOpen === link.name && (
                  <div className="pl-6">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block w-full text-left py-2 text-xs font-semibold uppercase tracking-wide text-gray-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}

              </React.Fragment>
            ))}

            {/* CTA */}
            <div className="pt-6">
              <InteractiveHoverButton
                href={"/offers"}
                onClick={closeMobileMenu}
              >
                BOOK NOW
              </InteractiveHoverButton>
            </div>
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navbar;