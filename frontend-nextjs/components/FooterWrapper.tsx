"use client";

import { usePathname } from "next/navigation";
import { FooterSection } from "./FooterSection";

const HIDE_FOOTER_ROUTES = ["/dashboard", "/components"];

export function FooterWrapper() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ROUTES.includes(pathname)) {
    return null;
  }

  return <FooterSection />;
}
