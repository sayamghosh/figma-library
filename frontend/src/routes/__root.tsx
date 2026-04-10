import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

import logoImg from "../assets/logo.svg";

export const Route = createRootRoute({
  component: RootLayout,
});

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
