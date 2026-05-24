import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import { FooterSection } from "../components/FooterSection";

export const metadata: Metadata = {
  title: "FigComponents",
  description: "Figma Components in Code",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
          <FooterSection />
        </Providers>
      </body>
    </html>
  );
}
