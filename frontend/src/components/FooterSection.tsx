import { Link } from "@tanstack/react-router";
import logoImg from "../assets/logo.svg";
import { Mail, ArrowRight } from "lucide-react";

const companyLinks = ["About Us", "Our Team", "Pricing Plans", "Faq", "Contact Us", "Refund Policy"];
const policyLinks = ["404", "Features", "Privacy Policy", "Careers", "Terms & Conditions"];

// Lucide style brand icons (removed in Lucide v1)
const Facebook = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Linkedin = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Youtube = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 58.4 58.4 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 58.4 58.4 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3z"/></svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function FooterSection() {
  return (
    <footer className="w-full bg-[linear-gradient(180deg,#e8f9db_0%,#f3ffe8_28%,#ffffff_72%)] px-5 pt-24 font-manrope sm:px-8 lg:pt-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1.2fr_1fr]">
          {/* Brand Column */}
          <div>
            <div className="flex items-center">
              <img src={logoImg} alt="figma components" className="h-10 w-auto object-contain" />
            </div>
            <p className="mt-9 max-w-[340px] text-[16px] leading-[1.6] text-[#565656]">
              Products & services are important. They might sell dairy, meat, maybe even eco-friendly manure compost. Including a CSA program...
            </p>
            <div className="mt-10 flex gap-4">
              <a href="#" className="grid h-12 w-12 place-items-center rounded-full border border-[#e0e0e0] bg-white text-black transition-all hover:bg-black hover:text-white">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="grid h-12 w-12 place-items-center rounded-full bg-black text-[#9FE870] transition-all hover:opacity-80">
                <XIcon className="h-5 w-5" />
              </a>
              <a href="#" className="grid h-12 w-12 place-items-center rounded-full border border-[#e0e0e0] bg-white text-black transition-all hover:border-black">
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="grid h-12 w-12 place-items-center rounded-full border border-[#e0e0e0] bg-white text-black transition-all hover:border-black">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Company Links Column */}
          <div>
            <p className="mb-10 inline-flex rounded-full border border-[#e5e5e5] bg-white px-6 py-1.5 text-sm font-medium tracking-wider text-black uppercase">
              Company
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col gap-4">
                {companyLinks.map((link) => (
                  <Link key={link} to="/" className="text-[15px] font-medium text-[#4d4d4d] transition-colors hover:text-black">
                    {link}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {policyLinks.map((link) => (
                  <Link key={link} to="/" className="text-[15px] font-medium text-[#4d4d4d] transition-colors hover:text-black">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <p className="mb-10 inline-flex rounded-full border border-[#e5e5e5] bg-white px-6 py-1.5 text-sm font-medium tracking-wider text-black uppercase">
              Weekly newsletter
            </p>
            <p className="max-w-[360px] text-[16px] leading-[1.6] text-[#565656]">
              Get every single updates from our weekly newsletter.
            </p>
            <form className="mt-8 flex flex-col gap-5">
              <div className="flex h-[60px] items-center rounded-full border border-[#e5e5e5] bg-white px-6 focus-within:border-black">
                <input
                  type="email"
                  placeholder="Business email"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-black outline-none placeholder:text-[#b9b9b9]"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <Mail size={16} strokeWidth={2} />
                </div>
              </div>
              <button type="button" className="group flex h-[50px] w-fit items-center gap-6 rounded-full bg-black py-2 pl-8 pr-2 text-[15px] font-bold text-white transition-all hover:opacity-90">
                Subscribe
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9FE870] text-black transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </div>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 border-t border-[#eeeeee] py-10 text-center text-[15px] font-medium text-[#575757]">
          Copyright & design by <span className="font-bold text-black">@figmacomponents.site</span> — 2026
        </div>
      </div>
    </footer>
  );
}
