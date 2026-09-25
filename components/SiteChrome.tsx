"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PopUp from '@/components/PopUp';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const hiddenRoutes = ['/checkout/confirm', '/checkout/failed'];

interface SiteChromeProps {
  initialActivities?: Array<{ name: string; id?: string; href?: string }>;
}

const SiteChrome: React.FC<SiteChromeProps> = ({ initialActivities }) => {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname) || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Navbar initialActivities={initialActivities} />
      <PopUp />
      <WhatsAppFloatingButton />
    </>
  );
};

export default SiteChrome;