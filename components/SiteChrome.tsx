"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PopUp from '@/components/PopUp';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const hiddenRoutes = ['/checkout/confirm', '/checkout/failed'];

const SiteChrome = () => {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname) || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Navbar />
      <PopUp />
      <WhatsAppFloatingButton />
    </>
  );
};

export default SiteChrome;