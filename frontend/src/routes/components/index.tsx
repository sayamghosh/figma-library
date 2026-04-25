import { useMemo, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { componentsApi } from "../../api/components";
import { copyToFigma } from "../../lib/clipboard";
import wireframeIcon from "../../assets/wireframe.png";

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
    <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.8 4.5H15l-4 3 1.5 4.5L8 10.5l-4.5 2.5L5 8.5l-4-3h5.2z" />
    </svg>
  );
}
function IconWireframe() {
  return <img src={wireframeIcon} alt="Wireframe" className="w-[18px] h-[18px] object-contain" />;
}
function IconPalette() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
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

// ── constants ─────────────────────────────────────────────────────────────────

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
type PriceMode = "free" | "pro" | "all";

// ── SkeletonCard ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col animate-pulse">
      {/* Preview placeholder */}
      <div className="h-[185px] bg-gray-200 rounded-none" />

      {/* Footer row placeholder */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-28 bg-gray-200 rounded-full" />
          <div className="h-3.5 w-10 bg-gray-100 rounded-md" />
        </div>
        <div className="h-4 w-4 bg-gray-200 rounded-full" />
      </div>

      {/* Actions placeholder */}
      <div className="px-2 pb-3 flex gap-1.5">
        <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
        <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
      </div>
    </article>
  );
}

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
              loading="lazy"
              decoding="async"
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
  item: { _id: string; name: string; previewImageUrl: string; tags: string[]; figmaDataBase64?: string; pricingType?: "Free" | "Pro"; designType?: "Wireframe" | "UI Design" };
  isCopying: boolean;
  onCopy: () => Promise<void>;
  onPreview: () => void;
}) {
  const isPro = item.pricingType === "Pro" || item.tags.some((t) => /pro/i.test(t));
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleCopy() {
    if (isCopying || isSuccess) return;
    await onCopy();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  }

  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col font-manrope">
      {/* Preview */}
      <div
        className="relative cursor-pointer group/preview overflow-hidden"
        onClick={onPreview}
        title="Click to preview"
      >
        {item.previewImageUrl ? (
          <img
            src={item.previewImageUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-[185px] w-full object-contain bg-[#F3F3F6] transition-transform duration-300 group-hover/preview:scale-[1.02]"
          />
        ) : (
          <div className="h-[185px] bg-[#F3F3F6] flex items-center justify-center text-gray-400 text-sm">
            No preview
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-gray-800 text-[0.88rem] truncate">{item.name}</span>
          {isPro ? (
            <span className="flex items-center gap-1 bg-[#8A2BE2] text-white text-[0.68rem] font-bold px-1.5 py-0.5 rounded-md shrink-0">
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
          className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
          aria-label="Favourite"
        >
          <IconHeart />
        </button>
      </div>

      {/* Actions */}
      <div className="px-2 pb-3 flex gap-1.5">
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopying || isSuccess}
          className={`flex-1 flex items-center justify-center gap-1.5 text-[0.8rem] font-semibold rounded-xl py-2 transition-all duration-300 cursor-pointer font-manrope border ${
            isSuccess 
              ? "bg-green-50 text-green-600 border-green-200" 
              : "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200"
          } disabled:opacity-100`}
        >
          {isSuccess ? (
            <span className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-green-500">
                <path d="M3 8.5L6 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </span>
          ) : (
            <>
              <IconCopy />
              {isCopying ? "Copying…" : "Copy"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1.5 text-[0.8rem] font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2 transition-colors cursor-pointer font-manrope"
        >
          <IconEye />
          Preview
        </button>
      </div>
    </article>
  );
}

// ── QUERY CONFIG (shared) ─────────────────────────────────────────────────────
const STALE_TIME = 5 * 60 * 1000;  // 5 minutes — cached data treated as fresh
const GC_TIME    = 10 * 60 * 1000; // 10 minutes — data kept in memory after unmount

function buildQueryOptions(search: string, tag?: string) {
  return {
    queryKey: ["components", "list", search, tag ?? ""],
    queryFn: () => componentsApi.list(search, tag ?? ""),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData, // keeps old data visible while re-fetching
  } as const;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function ComponentsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("ui-design");
  const [priceMode, setPriceMode] = useState<PriceMode>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<null | {
    name: string;
    previewImageUrl: string;
    tags: string[];
  }>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    buildQueryOptions(search)
  );

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.pagination?.total ?? items.length;

  // ── Prefetch a category on hover ───────────────────────────────────────────
  const prefetchCategory = useCallback(
    (cat: string) => {
      const tag = cat === "All" ? "" : cat;
      queryClient.prefetchQuery({
        ...buildQueryOptions(search, tag),
        // Only prefetch if data isn't already cached / fresh
      });
    },
    [queryClient, search]
  );

  // ── Client-side filters ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let out = items;
    if (activeCategory !== "All") {
      out = out.filter((i) =>
        i.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    if (priceMode === "pro") {
      out = out.filter((i) => i.pricingType === "Pro" || i.tags.some((t) => /pro/i.test(t)));
    } else if (priceMode === "free") {
      out = out.filter((i) => i.pricingType !== "Pro" && !i.tags.some((t) => /pro/i.test(t)));
    }
    if (viewMode === "wireframe") {
      out = out.filter((i) => i.designType === "Wireframe" || i.tags.some((t) => /wireframe/i.test(t)));
    } else if (viewMode === "ui-design") {
      out = out.filter((i) => i.designType === "UI Design" || !i.designType || i.tags.some((t) => /ui[\s-]*design/i.test(t)));
    }
    return out;
  }, [items, activeCategory, priceMode, viewMode]);

  // ── Copy handler ───────────────────────────────────────────────────────────
  async function onCopy(id: string, name: string, figmaDataBase64?: string) {
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
      await copyToFigma(payload, name);
    } catch (error) {
      console.error("Copy failed:", error);
    } finally {
      setActiveId(null);
    }
  }

  // How many skeleton cards to show
  const SKELETON_COUNT = 12;
  const showSkeletons = isLoading;
  // isFetching (but not initial load) = stale re-fetch in background — keep old data, no skeleton
  const showStaleIndicator = isFetching && !isLoading;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F3F3F6] relative">
      {/* ── Left Sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-gray-200 bg-white pt-2 pb-8 overflow-y-auto font-manrope">

        {/* Components section */}
        <div className="px-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[16px] font-bold text-gray-800">
            <span className="text-[#8A2BE2]">✦</span>
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
              onMouseEnter={() => prefetchCategory(cat)}
              onFocus={() => prefetchCategory(cat)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-[0.82rem] font-medium transition-colors cursor-pointer font-manrope ${
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
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Page title section */}
        <div className="px-6 pt-2 pb-2 bg-white">
          <h1 className="font-outfit font-semibold text-[21px] text-[#161616] leading-tight">
            Browse Figma Components, Wireframe &amp; UI Design
          </h1>
          <p className="font-manrope font-normal text-[14px] text-gray-500 mt-0.5">
            {total > 0 ? `${total}+ Components` : "Components"}
          </p>
        </div>

        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-20 px-6 py-3 bg-white border-b border-gray-200 font-manrope">
          <div className="flex flex-wrap items-center gap-4">
            {/* View mode segmented control */}
            <div className="flex items-center bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("wireframe")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-[0.82rem] font-bold transition-all cursor-pointer ${
                  viewMode === "wireframe"
                    ? "bg-[#8A2BE2] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IconWireframe />
                Wireframe
              </button>
              <button
                type="button"
                onClick={() => setViewMode("ui-design")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded text-[0.82rem] font-bold transition-all cursor-pointer ${
                  viewMode === "ui-design"
                    ? "bg-[#8A2BE2] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IconPalette />
                UI Design
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Pricing segmented control */}
            <div className="flex items-center bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded p-1 gap-1">
              <button
                type="button"
                onClick={() => setPriceMode("free")}
                className={`px-5 py-1.5 rounded text-[0.82rem] font-bold transition-all cursor-pointer ${
                  priceMode === "free"
                    ? "bg-[#8A2BE2] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setPriceMode("pro")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded text-[0.82rem] font-bold transition-all cursor-pointer ${
                  priceMode === "pro"
                    ? "bg-[#8A2BE2] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IconStar />
                Pro
              </button>
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative w-full max-w-[450px]">
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
                className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-[0.78rem] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                placeholder="Search components…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Refresh button — shows subtle spinner when background re-fetch is happening */}
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center justify-center min-w-[80px] text-[0.76rem] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors shrink-0 cursor-pointer"
            >
              {showStaleIndicator ? (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                "Refresh"
              )}
            </button>
          </div>
        </div>

        {/* Grid area */}
        <div className="flex-1 px-6 py-5">
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
            {/* Skeleton cards during initial load */}
            {showSkeletons &&
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}

            {/* Real cards — shown as soon as data arrives (or placeholderData) */}
            {!showSkeletons &&
              filtered.map((item) => (
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
