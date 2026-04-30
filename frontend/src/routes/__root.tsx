import { Link, Outlet, createRootRoute, useRouter, useLocation } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

import logoImg from "../assets/logo.svg";
import { RegisterModal } from "../components/RegisterModal";
import { LoginModal } from "../components/LoginModal";

export const Route = createRootRoute({
  component: RootLayout,
});

// ── helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── UserAvatar dropdown ───────────────────────────────────────────────────────
function UserAvatar({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#A020F0] text-white text-[0.8rem] font-bold shadow-md hover:shadow-lg transition-all ring-2 ring-white focus:outline-none focus:ring-purple-300 cursor-pointer"
        aria-label="User menu"
        aria-expanded={open}
      >
        {getInitials(name)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[0.85rem] font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-[0.75rem] text-gray-400 truncate mt-0.5">{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              to="/my-components"
              onClick={() => setOpen(false)}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[0.83rem] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              My Components
            </Link>
            <div className="mx-3 border-t border-gray-100 my-1" />
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[0.83rem] font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hamburger icon ────────────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="transition-transform">
      {open ? (
        <>
          <path d="M5 5l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M3 6h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 11h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ── RootLayout ────────────────────────────────────────────────────────────────
function RootLayout() {
  const { user, logout, loading, setRegisterModalOpen, registerModalOpen, setLoginModalOpen, loginModalOpen } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isComponentsPage = location.pathname.startsWith("/components");
  const bgClass = isLandingPage ? "bg-[#eef1f7]" : "bg-white";

  // Close drawer on route change
  useEffect(() => {
    return router.subscribe("onBeforeLoad", () => setMobileOpen(false));
  }, [router]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Components", to: "/components" },
    { label: "Resources", to: "/add-component" },
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <div className={`min-h-screen ${bgClass} font-sans text-gray-900 overflow-x-hidden selection:bg-purple-200`}>
      {/* ── Header ── */}
      <header className={`relative z-30 ${isLandingPage ? "bg-transparent" : bgClass} ${isComponentsPage ? "border-b border-gray-200" : ""}`}>
        <div className={isLandingPage ? "mx-auto w-full max-w-[1320px] px-5 pt-8 sm:px-8 2xl:px-0" : "flex items-center justify-between px-5 lg:px-12 py-4 mx-auto w-full 2xl:max-w-[1536px]"}>
          <div className={isLandingPage ? "flex min-h-[68px] items-center justify-between rounded-full bg-white py-2 pl-5 pr-2.5 shadow-[0_1px_0_rgba(16,24,40,0.03)] lg:pl-6" : "contents"}>
          {/* Logo */}
          <Link to="/" onClick={() => setMobileOpen(false)} className="shrink-0">
            <img src={logoImg} alt="FigComponents Logo" className="h-8 w-auto object-contain" />
          </Link>

          <nav className={isLandingPage ? "hidden lg:flex items-center gap-[38px] font-manrope text-[15px] font-extrabold text-[#15171b]" : "hidden lg:flex items-center gap-10 font-manrope font-semibold text-[18px] text-gray-700"}>
            {navLinks.map((l) => {
              const content = (
                <span className="flex flex-col items-center">
                  <span className="font-extrabold invisible h-0 overflow-hidden" aria-hidden="true">{l.label}</span>
                  <span className="transition-all duration-200">{l.label}</span>
                </span>
              );
              return l.to ? (
                <Link 
                  key={l.label} 
                  to={l.to} 
                  className={`${isLandingPage ? "hover:text-[#8c45d9]" : "hover:text-[#A855F7] hover:font-extrabold"} transition-all cursor-pointer`}
                >
                  {content}
                </Link>
              ) : (
                <a 
                  key={l.label} 
                  href={l.href} 
                  className={`${isLandingPage ? "hover:text-[#8c45d9]" : "hover:text-[#A855F7] hover:font-extrabold"} transition-all cursor-pointer`}
                >
                  {content}
                </a>
              );
            })}
          </nav>

          {/* Desktop actions + mobile right-side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Auth — always visible */}
            {!loading && !user ? (
              <>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className={`${isLandingPage ? "hidden h-[54px] rounded-full bg-[#96e96a] px-7 font-manrope text-[15px] font-extrabold text-[#111318] hover:bg-[#8de35f] sm:inline-flex sm:items-center" : "hidden sm:inline text-[0.95rem] font-bold text-gray-900 hover:text-black transition-colors bg-transparent border-none p-0"} cursor-pointer`}
                >
                  {isLandingPage ? "Sign In" : "Login"}
                </button>
                {!isLandingPage && <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[0.88rem] sm:text-[0.95rem] font-medium transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  Start for free
                </button>}
              </>
            ) : user ? (
              <UserAvatar name={user.name} email={user.email} onLogout={logout} />
            ) : null}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className={`${isLandingPage ? "bg-[#96e96a] text-[#111318] hover:bg-[#8de35f]" : "text-gray-700 hover:bg-gray-200"} lg:hidden flex items-center justify-center w-11 h-11 rounded-full transition-colors`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <div className="absolute top-full left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-xl lg:hidden">
              <nav className="flex flex-col px-5 py-4 gap-1">
                {navLinks.map((l) =>
                  l.to ? (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl font-manrope font-normal text-[16px] text-gray-700 hover:bg-gray-50 hover:text-black hover:font-bold transition-all"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl font-manrope font-normal text-[16px] text-gray-700 hover:bg-gray-50 hover:text-black hover:font-bold transition-all"
                    >
                      {l.label}
                    </a>
                  )
                )}

                {/* Auth links in drawer */}
                {!loading && !user && (
                  <>
                    <div className="border-t border-gray-100 my-2" />
                    <button
                      onClick={() => { setMobileOpen(false); setLoginModalOpen(true); }}
                      className="flex items-center px-3 py-3 rounded-xl text-[0.95rem] font-bold text-gray-900 hover:bg-gray-50 transition-colors w-full text-left bg-transparent border-none cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); setRegisterModalOpen(true); }}
                      className="flex items-center justify-center px-3 py-3 rounded-xl text-[0.95rem] font-semibold bg-[#8A2BE2] text-white hover:bg-[#7b22cc] transition-colors w-full"
                      style={{ color: "#ffffff" }}
                    >
                      Start for free
                    </button>
                  </>
                )}

                {/* Logged-in quick links in drawer */}
                {user && (
                  <>
                    <div className="border-t border-gray-100 my-2" />
                    <Link
                      to="/my-components"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                      My Components
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-[0.95rem] font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sign out
                    </button>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </header>

      <main className={`${isLandingPage ? "w-full" : "w-full 2xl:max-w-[1536px]"} mx-auto flex-1`}>
        <Outlet />
      </main>
      
      {registerModalOpen && <RegisterModal />}
      {loginModalOpen && <LoginModal />}
    </div>
  );
}
