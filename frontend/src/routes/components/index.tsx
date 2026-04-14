import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { componentsApi } from "../../api/components";
import { copyToFigma } from "../../lib/clipboard";

export const Route = createFileRoute("/components/")({
  component: ComponentsPage,
});

// ── icons (inline SVGs to avoid extra deps) ──────────────────────────────────
function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 11V2.5A1.5 1.5 0 014.5 1H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3a3.5 3.5 0 016 2c0 4-6 8.5-6 8.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.8 4.5H15l-4 3 1.5 4.5L8 10.5l-4.5 2.5L5 8.5l-4-3h5.2z" />
    </svg>
  );
}
function IconWireframe() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="3" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="9" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3" y1="12.5" x2="10" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1a7 7 0 100 14c1 0 2-.8 2-2s-.8-2-2-2H6a1 1 0 010-2h3a5 5 0 10-1 9.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="4.5" cy="7" r="1" fill="currentColor" />
      <circle cx="7" cy="4" r="1" fill="currentColor" />
      <circle cx="11" cy="5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 6l4-2v8l-4-2V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function IconClone() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="6" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}


// ── constants ─────────────────────────────────────────────────────────────────
const SOURCE_UIS = ["All", "Root UI", "Maple UI", "Medifye", "Rallyfy"] as const;
const SOURCE_UI_COLORS: Record<string, string> = {
  "Root UI": "#22c55e",
  "Maple UI": "#ef4444",
  "Medifye": "#3b82f6",
  "Rallyfy": "#f97316",
};

const CATEGORIES = [
  "All",
  "Navigation",
  "Hero",
  "Icon Section",
  "Content",
  "Rich Content",
  "Process",
  "Metrics",
  "Pricing",
  "Testimonials",
  "CTA",
  "Footer",
] as const;

type ViewMode = "wireframe" | "ui-design";
type ColorMode = "light" | "gray" | "dark";
type PriceMode = "free" | "pro" | "all";

// ── PreviewModal ──────────────────────────────────────────────────────────────
function PreviewModal({
  item,
  onClose,
}: {
  item: { name: string; previewImageUrl: string; tags: string[] };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-800">{item.name}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <IconX />
          </button>
        </div>
        <div className="p-4 bg-[#F3F3F6]">
          {item.previewImageUrl ? (
            <img
              src={item.previewImageUrl}
              alt={item.name}
              className="w-full rounded-xl object-contain max-h-[60vh] bg-white"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              No preview available
            </div>
          )}
        </div>
        <div className="px-5 py-4 flex gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ComponentCard ─────────────────────────────────────────────────────────────
function ComponentCard({
  item,
  isCopying,
  onCopy,
  onPreview,
}: {
  item: { _id: string; name: string; previewImageUrl: string; tags: string[]; figmaDataBase64?: string };
  isCopying: boolean;
  onCopy: () => void;
  onPreview: () => void;
}) {
  const isPro = item.tags.some((t) => /pro/i.test(t));

  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      {/* Preview */}
      <div className="relative">
        <div
          className="h-[185px] bg-[#F3F3F6] bg-center bg-contain bg-no-repeat"
          style={item.previewImageUrl ? { backgroundImage: `url(${item.previewImageUrl})` } : {}}
          aria-label={item.name}
        >
          {!item.previewImageUrl && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No preview
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-gray-800 text-[0.88rem] truncate">{item.name}</span>
          {isPro ? (
            <span className="flex items-center gap-1 bg-[#22c55e] text-white text-[0.68rem] font-bold px-1.5 py-0.5 rounded-md shrink-0">
              <IconStar />
              PRO
            </span>
          ) : (
            <span className="text-[0.68rem] font-bold text-gray-400 px-1.5 py-0.5 rounded-md border border-gray-200 shrink-0">
              FREE
            </span>
          )}
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-red-400 transition-colors p-1"
          aria-label="Favourite"
        >
          <IconHeart />
        </button>
      </div>

      {/* Actions */}
      <div className="px-2 pb-3 flex gap-1.5">
        <button
          type="button"
          onClick={onCopy}
          disabled={isCopying}
          className="flex-1 flex items-center justify-center gap-1.5 text-[0.8rem] font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2 transition-colors disabled:opacity-60"
        >
          <IconCopy />
          {isCopying ? "Copying…" : "Copy"}
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1.5 text-[0.8rem] font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2 transition-colors"
        >
          <IconEye />
          Preview
        </button>
      </div>
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function ComponentsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSource, setActiveSource] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("ui-design");
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [priceMode, setPriceMode] = useState<PriceMode>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewItem, setPreviewItem] = useState<null | {
    name: string;
    previewImageUrl: string;
    tags: string[];
  }>(null);
  const [gettingStartedDismissed, setGettingStartedDismissed] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["components", "list", search],
    queryFn: () => componentsApi.list(search),
    staleTime: 2 * 60 * 1000,
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.pagination?.total ?? items.length;

  // Client-side tag filter
  const filtered = useMemo(() => {
    let out = items;
    if (activeCategory !== "All") {
      out = out.filter((i) =>
        i.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    if (priceMode === "pro") {
      out = out.filter((i) => i.tags.some((t) => /pro/i.test(t)));
    } else if (priceMode === "free") {
      out = out.filter((i) => !i.tags.some((t) => /pro/i.test(t)));
    }
    return out;
  }, [items, activeCategory, priceMode]);

  async function onCopy(id: string, name: string, figmaDataBase64?: string) {
    setStatusMsg("");
    setActiveId(id);
    try {
      const payload =
        figmaDataBase64 ||
        (
          await queryClient.fetchQuery({
            queryKey: ["components", "detail", id],
            queryFn: () => componentsApi.getById(id),
            staleTime: 10 * 60 * 1000,
          })
        ).figmaDataBase64;
      if (!payload) throw new Error("Component payload is missing.");
      const mode = await copyToFigma(payload, name);
      setStatusMsg(
        mode === "copied-binary"
          ? `✓ Copied "${name}" to clipboard.`
          : `✓ Copied "${name}" (HTML fallback).`
      );
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : "Copy failed.");
    } finally {
      setActiveId(null);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#F3F3F6] relative">
      {/* ── Left Sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-gray-200 bg-white pt-4 pb-8 overflow-y-auto">
        {/* UI Library header */}
        <div className="px-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[0.82rem] font-bold text-gray-800">
            <span className="text-[#22c55e] text-base">✦</span>
            UI Library
          </div>
          <button
            type="button"
            onClick={() => { setActiveCategory("All"); setActiveSource("All"); setPriceMode("all"); }}
            className="text-[0.7rem] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Source UI pills */}
        <div className="px-3 grid grid-cols-2 gap-1.5 mb-4">
          {SOURCE_UIS.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveSource(src)}
              className={`flex items-center gap-1.5 text-[0.74rem] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                activeSource === src
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {src !== "All" && (
                <span
                  className="inline-block w-3 h-3 rounded-sm shrink-0"
                  style={{ background: SOURCE_UI_COLORS[src] ?? "#888" }}
                />
              )}
              {src}
            </button>
          ))}
        </div>

        <div className="mx-4 border-t border-gray-100 mb-3" />

        {/* Components section */}
        <div className="px-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[0.8rem] font-bold text-gray-800">
            <span className="text-[#22c55e]">✦</span>
            Components
          </div>
          <span className="text-[0.68rem] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {total}
          </span>
        </div>

        <nav className="flex flex-col px-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-[0.82rem] font-medium transition-colors ${
                activeCategory === cat
                  ? "text-[#8A2BE2] bg-purple-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {cat}
              <IconChevron />
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 pt-5 pb-3 bg-white border-b border-gray-200">
          <h1 className="text-[1.35rem] font-bold text-gray-900 leading-tight">
            Browse Webflow, Figma, Framer &amp; Tailwind Components
          </h1>
          <p className="text-[0.82rem] text-gray-500 mt-0.5">
            {total > 0 ? `${total}+ Components` : "Components"}
          </p>

          {/* Toolbar */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* View mode */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setViewMode("wireframe")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[0.78rem] font-semibold transition-all ${
                  viewMode === "wireframe"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconWireframe />
                Wireframe
              </button>
              <button
                type="button"
                onClick={() => setViewMode("ui-design")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[0.78rem] font-semibold transition-all ${
                  viewMode === "ui-design"
                    ? "bg-[#22c55e] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconPalette />
                UI Design
              </button>
            </div>

            <div className="w-px h-5 bg-gray-200" />

            {/* Color mode */}
            <div className="flex items-center gap-1">
              {(["light", "gray", "dark"] as ColorMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setColorMode(mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[0.78rem] font-semibold transition-all border ${
                    colorMode === mode
                      ? mode === "light"
                        ? "bg-[#22c55e] text-white border-transparent"
                        : "bg-gray-800 text-white border-transparent"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {mode === "dark" && (
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-900 border border-gray-400" />
                  )}
                  {mode === "gray" && (
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
                  )}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-gray-200" />

            {/* Pricing */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPriceMode("free")}
                className={`px-2.5 py-1.5 rounded-full text-[0.78rem] font-semibold transition-all border ${
                  priceMode === "free"
                    ? "bg-gray-800 text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setPriceMode("pro")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[0.78rem] font-semibold transition-all border ${
                  priceMode === "pro"
                    ? "bg-[#22c55e] text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <IconStar />
                Pro
              </button>
            </div>

            <div className="flex-1" />

            {/* Tutorial / Clone Style Guide */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[0.76rem] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
              >
                <IconVideo />
                User Tutorial
              </button>
              <button
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[0.76rem] font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
              >
                <IconClone />
                Clone Style Guide
              </button>
            </div>
          </div>

          {/* Getting started bar */}
          {!gettingStartedDismissed && (
            <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 overflow-x-auto">
              <span className="text-[0.78rem] font-bold text-gray-700 shrink-0">Getting started</span>
              {[
                "Clone Style Guide",
                "Add Extension",
                "Copy Components",
                "Paste into your project",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[0.68rem] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[0.76rem] text-gray-600 font-medium">{step}</span>
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                      <IconInfo />
                    </button>
                  </div>
                  {i < 3 && <div className="w-px h-4 bg-gray-200" />}
                </div>
              ))}
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setGettingStartedDismissed(true)}
                className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-auto"
              >
                <IconX />
              </button>
            </div>
          )}
        </div>

        {/* Search + status */}
        <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[0.84rem] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
              placeholder="Search components…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {statusMsg && (
            <div className="flex items-center gap-2 text-[0.78rem] text-gray-600 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5">
              {statusMsg}
              <button
                type="button"
                onClick={() => setStatusMsg("")}
                className="text-gray-400 hover:text-gray-700"
              >
                <IconX />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-auto flex items-center gap-1.5 text-[0.78rem] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors shrink-0"
          >
            Refresh
          </button>
        </div>

        {/* Grid area */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
              Loading components…
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center py-24 text-red-400 text-sm">
              Could not load components from API.
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
              <IconGrid />
              <p className="text-sm">No components match your filters.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ComponentCard
                key={item._id}
                item={item}
                isCopying={activeId === item._id}
                onCopy={() => onCopy(item._id, item.name, item.figmaDataBase64)}
                onPreview={() =>
                  setPreviewItem({
                    name: item.name,
                    previewImageUrl: item.previewImageUrl,
                    tags: item.tags,
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>



      {/* Preview Modal */}
      {previewItem && (
        <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}
