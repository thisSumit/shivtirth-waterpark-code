"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const getParkSectionId = (name: string) => {
  return (name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

type ActivityItem = {
  name: string;
  id?: string;
  href?: string;
};

const defaultParksDropdownItems: ActivityItem[] = [
  // { name: 'Bird Park', id: getParkSectionId('Bird Park') },
  { name: 'Agro Park', id: getParkSectionId('Agro Park') },
  { name: 'Air Tourism', id: getParkSectionId('Air Tourism') },
  { name: 'Accommodation', href: '/accommodation' },
  { name: 'Wedding Celebrations', id: getParkSectionId('Wedding Celebrations') },
  { name: 'Dining', id: getParkSectionId('Dining') },
  { name: 'Corporate Events', id: getParkSectionId('Corporate Events') },
  { name: 'Birthday Parties', id: getParkSectionId('Birthday Parties') },
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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>(defaultParksDropdownItems);

  useEffect(() => {
    async function loadActivities() {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('id, title, park_type, is_hidden')
          .eq('is_hidden', false)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: ActivityItem[] = data.map((act) => {
            if (act.title.toLowerCase().includes('accommodation') || act.title.toLowerCase().includes('stay')) {
              return { name: 'Accommodation', href: '/accommodation' };
            }
            return {
              name: act.title,
              id: getParkSectionId(act.title),
            };
          });

          const hasAccommodation = mapped.some(
            (item) => item.href === '/accommodation' || item.name.toLowerCase().includes('accommodation')
          );

          if (!hasAccommodation) {
            mapped.splice(2, 0, { name: 'Accommodation', href: '/accommodation' });
          }

          setActivitiesList(mapped);
        }
      } catch (err) {
        console.error('Error loading navbar activities:', err);
      }
    }

    loadActivities();
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'WaterPark', href: '/water-park' },
    { name: 'Boating Park', href: '/boating-park' },
    { name: 'Adventure Park', href: '/adventure-park' },
    { name: 'Amusement Park', href: '/amusement-park' },
    { name: 'Bird Park', href: '/bird-park' },
    { name: 'School Picnic', href: '/school-picnic' },
    { name: 'Accommodation', href: '/accommodation' },
    { name: 'Offers & Packages', href: '/offers' },
    { name: 'Other Activities/Parks', href: '/parks-experiences', hasDropdown: true },
    // {
    //   name: 'Other Links',
    //   dropdownItems: [
    //     { name: 'About Us', href: '/about' },
    //     { name: 'Contact Us', href: '/contact' },
    //     // { name: 'Accommodation', href: '/accommodation' },
    //     { name: 'Influencer Collaboration', href: '/influencer-collab' },
    //     { name: 'Gallery', href: 'https://www.instagram.com/shivtirthbestwaterpark/' },
    //   ],
    // },
  ];

  const scrollingMessages = [
    'विदर्भ का सबसे बडा',
    'ऊँचे लोग , उँची पसंद ...',
    'मौज मस्ती चाहिये, शिवतीर्थ आइए',
    'विदर्भ का सबसे बडा',
    'ऊँचे लोग , उँची पसंद ...',
    'मौज मस्ती चाहिये, शिवतीर्थ आइए'
  ];

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
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-accent text-black py-2 overflow-hidden shadow-sm">
  <div className="flex w-max animate-scroll whitespace-nowrap">
    {[...scrollingMessages, ...scrollingMessages].map((message, index) => (
      <span
        key={index}
        className="inline-flex shrink-0 items-center mx-6 text-xs md:text-sm font-semibold"
      >
        <span className="mr-2">✨</span>
        {message}
        <span className="ml-2">✨</span>
      </span>
    ))}
  </div>
</div>

      {/* Navbar */}
      <nav className={`fixed top-8 left-0 right-0 z-[999] transition-all duration-300 ${scrolled || isOpen ? 'bg-white shadow-lg border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-8xl mx-auto px-3 xl:px-4">
          <div className="relative z-[1000] flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" onClick={closeMobileMenu} className="shrink-0 px-1 xl:px-2">
              <Image src="/logo.png" alt="Shivtirth Water Park" width={160} height={50} className="h-11 xl:h-14 w-auto" priority />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center whitespace-nowrap">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.href ? (
                    <Link
                      href={link.href}
                      className={`shrink-0 whitespace-nowrap text-[11px] xl:text-[12.5px] font-bold uppercase tracking-tight flex items-center px-2 py-1.5 rounded-md transition ${scrolled ? 'text-slate-800' : 'text-white'} hover:text-amber-500 hover:bg-amber-500/10`}
                    >
                      {link.name}
                      {(link.hasDropdown || link.dropdownItems) && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`shrink-0 whitespace-nowrap text-[11px] xl:text-[12.5px] font-bold uppercase tracking-tight flex items-center gap-0.5 px-1.5 py-1.5 rounded-md transition ${scrolled ? 'text-slate-800' : 'text-white'} hover:text-amber-500 hover:bg-amber-500/10`}
                    >
                      {link.name}
                      {(link.hasDropdown || link.dropdownItems) && <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Dropdown Desktop */}
                  {link.hasDropdown && (
                    <div className="absolute left-0 mt-0 w-64 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 max-h-80 overflow-y-auto border border-slate-100">
                      {activitiesList.map((item, idx) => (
                        item.href ? (
                          <Link
                            key={`${item.name}-${idx}`}
                            href={item.href}
                            className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-amber-100/60 hover:text-slate-950 transition"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <button
                            key={`${item.id}-${idx}`}
                            onClick={() => handleScrollToSection(item.id!)}
                            className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-amber-100/60 hover:text-slate-950 transition"
                          >
                            {item.name}
                          </button>
                        )
                      ))}
                    </div>
                  )}

                  {link.dropdownItems && (
                    <div className="absolute left-0 mt-0 w-56 bg-white shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 border border-slate-100">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:bg-amber-100/60 hover:text-slate-950 transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <InteractiveHoverButton
              href={"/offers"}
              className="hidden xl:block shrink-0"
            >
              Book Now
            </InteractiveHoverButton>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`lg:hidden relative z-[1001] p-2.5 rounded-lg transition-colors ${isOpen || scrolled ? 'text-slate-900 bg-slate-100/80' : 'text-white bg-black/30 backdrop-blur-sm'
                }`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 top-28 bg-white z-[998] overflow-y-auto transition-all duration-300 ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
            }`}
        >
          <div className="px-5 py-6 space-y-3 pb-24">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-slate-100 pb-2">
                {link.hasDropdown || link.dropdownItems ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileDropdownOpen((prev) => (prev === link.name ? null : link.name))}
                      className="w-full text-left py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-between text-slate-800 hover:text-amber-600"
                    >
                      <span>{link.name}</span>
                      {mobileDropdownOpen === link.name ? (
                        <ChevronUp className="w-4 h-4 text-amber-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Dropdown Mobile Activities */}
                    {link.hasDropdown && mobileDropdownOpen === link.name && (
                      <div className="pl-4 py-2 space-y-1.5 bg-slate-50 rounded-xl my-1 border border-slate-100">
                        {activitiesList.map((item, idx) => (
                          item.href ? (
                            <Link
                              key={`${item.name}-${idx}`}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="block w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-950"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              key={`${item.id}-${idx}`}
                              type="button"
                              onClick={() => {
                                handleScrollToSection(item.id!);
                                closeMobileMenu();
                              }}
                              className="block w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-950"
                            >
                              {item.name}
                            </button>
                          )
                        ))}
                      </div>
                    )}

                    {/* Dropdown Mobile Links */}
                    {link.dropdownItems && mobileDropdownOpen === link.name && (
                      <div className="pl-4 py-2 space-y-1.5 bg-slate-50 rounded-xl my-1 border border-slate-100">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="block w-full text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-950"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href || '/'}
                    onClick={closeMobileMenu}
                    className="block w-full text-left py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-800 hover:text-amber-600"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 flex justify-center">
              <InteractiveHoverButton
                href={"/offers"}
                onClick={closeMobileMenu}
                className="w-full justify-center text-center py-3 text-sm font-bold"
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