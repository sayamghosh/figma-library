import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900 overflow-x-hidden selection:bg-purple-200">
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 mx-auto max-w-[1400px]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M4 16L16 4l12 12-12 12L4 16z" fill="url(#paint_logo)" />
              <path d="M8 16L16 8l8 8-8 8-8-8z" fill="#fff" opacity="0.3" />
              <defs>
                <linearGradient id="paint_logo" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="0.5" stopColor="#9333EA" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-extrabold text-[1.15rem] tracking-tighter text-black uppercase">
            FIGCOMPONENTS
          </span>
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
              <Link to="/auth/register" className="bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-6 py-2.5 rounded-lg text-[0.95rem] font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-[1px]">
                Start for free
              </Link>
            </>
          ) : user ? (
            <button type="button" className="text-[0.95rem] font-bold text-gray-800 hover:text-black" onClick={logout}>
              Logout ({user.name})
            </button>
          ) : null}
        </div>
      </header>

      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
