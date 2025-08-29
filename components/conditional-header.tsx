"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't render the main header on admin panel pages
  if (pathname.startsWith('/panel')) {
    return null;
  }
  
  return <Header />;
}