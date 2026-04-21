import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
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
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#A020F0] text-white text-[0.8rem] font-bold shadow-md hover:shadow-lg transition-all ring-2 ring-white focus:outline-none focus:ring-purple-300"
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
    { label: "Products", to: "/" },
    { label: "Components", to: "/components" },
    { label: "Resources", to: "/add-component" },
    { label: "Pricing", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F6] font-sans text-gray-900 overflow-x-hidden selection:bg-purple-200">
      {/* ── Header ── */}
      <header className="relative z-30 bg-[#F3F3F6]">
        <div className="flex items-center justify-between px-5 lg:px-12 py-4 mx-auto w-full 2xl:max-w-[1536px]">
          {/* Logo */}
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={logoImg} alt="FigComponents Logo" className="h-8 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10 text-[0.95rem] font-medium text-gray-700">
            {navLinks.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="hover:text-black transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="hover:text-black transition-colors">
                  {l.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop actions + mobile right-side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Auth — always visible */}
            {!loading && !user ? (
              <>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="hidden sm:inline text-[0.95rem] font-bold text-gray-900 hover:text-black transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[0.88rem] sm:text-[0.95rem] font-medium transition-all shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  Start for free
                </button>
              </>
            ) : user ? (
              <UserAvatar name={user.name} email={user.email} onLogout={logout} />
            ) : null}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
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
                      className="flex items-center px-3 py-3 rounded-xl text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
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

      <main className="w-full 2xl:max-w-[1536px] mx-auto flex-1">
        <Outlet />
      </main>
      
      {registerModalOpen && <RegisterModal />}
      {loginModalOpen && <LoginModal />}
    </div>
  );
}
