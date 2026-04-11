import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

import logoImg from "../assets/logo.svg";

export const Route = createRootRoute({
  component: RootLayout,
});

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function UserAvatar({ name, email, onLogout }: { name: string; email: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RootLayout() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#F3F3F6] font-sans text-gray-900 overflow-x-hidden selection:bg-purple-200">
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 mx-auto max-w-[1400px]">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logoImg} alt="FigComponents Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-10 text-[0.95rem] font-medium text-gray-700">
          <Link to="/" className="hover:text-black transition-colors">Products</Link>
          <Link to="/components" className="hover:text-black transition-colors">Components</Link>
          <Link to="/add-component" className="hover:text-black transition-colors">Resources</Link>
          <a href="#" className="hover:text-black transition-colors">Pricing</a>
          <a href="#" className="hover:text-black transition-colors">FAQ</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {!loading && !user ? (
            <>
              <Link to="/auth/login" className="text-[0.95rem] font-bold text-gray-900 hover:text-black transition-colors">
                Login
              </Link>
              <Link to="/auth/register" className="bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-6 py-2.5 rounded-lg text-[0.95rem] font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-[1px]" style={{ color: "#ffffff" }}>
                Start for free
              </Link>
            </>
          ) : user ? (
            <UserAvatar name={user.name} email={user.email} onLogout={logout} />
          ) : null}
        </div>
      </header>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
