import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">My Figma Library</div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/components" className="nav-link">
            Components
          </Link>
          <Link to="/add-component" className="nav-link">
            Add Component
          </Link>
          {!loading && !user ? (
            <>
              <Link to="/auth/login" className="nav-link">
                Login
              </Link>
              <Link to="/auth/register" className="nav-link accent-link">
                Register
              </Link>
            </>
          ) : null}
          {user ? (
            <button type="button" className="nav-link btn-link" onClick={logout}>
              Logout ({user.name})
            </button>
          ) : null}
        </nav>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
