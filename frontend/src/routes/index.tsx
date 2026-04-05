import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <section className="landing-grid">
      <p className="eyebrow">// COMPONENT LIBRARY</p>
      <h1 className="hero-title">
        Your Figma <span>components.</span>
        <br />
        One click away.
      </h1>
      <p className="hero-copy">
        Build and store reusable Figma components, upload previews to Cloudinary, and copy
        payloads back into Figma instantly.
      </p>

      <div className="hero-actions">
        <Link to="/components" className="primary-btn">
          Browse Components
        </Link>
        <Link to="/add-component" className="secondary-btn">
          Add Your Component
        </Link>
      </div>

      <div className="hero-note">
        Demo mode: add your own component through the add page by pasting directly from Figma.
      </div>
    </section>
  );
}
