"use client";

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

const hiddenRoutes = ['/checkout/confirm', '/checkout/failed'];

const SiteFooter = () => {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname) || pathname.startsWith('/admin')) {
    return null;
  }

  return <Footer />;
};

export default SiteFooter;