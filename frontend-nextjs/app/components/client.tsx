"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { componentsApi } from "../../api/components";
import { paymentsApi } from "../../api/payments";
import { copyToFigma } from "../../lib/clipboard";
import type { PaginatedComponentResponse, ComponentItem } from "../../lib/types";
import { useAuth } from "../../context/AuthContext";
import { Scaling, Frame, Copy, Component, Crown } from "lucide-react";



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
  return <Frame size={18} />;
}
function IconPalette() {
  return <Scaling size={18} />;
}
function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7l5-2.5M5.5 9l5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconUnlock({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
function IconLogoFourDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#9FE870" strokeWidth="2" fill="none" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#9FE870" strokeWidth="2" fill="none" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#9FE870" strokeWidth="2" fill="none" />
      <path d="M14 17.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z" stroke="#9FE870" strokeWidth="2" fill="none" />
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
type PlatformMode = "all" | "web" | "app";

const PAGE_SIZE = 15;
const INITIAL_VIEW_MODE: ViewMode = "ui-design";
const INITIAL_PRICE_MODE: PriceMode = "all";
const INITIAL_PLATFORM_MODE: PlatformMode = "all";

function isProComponent(item: Pick<ComponentItem, "pricingType" | "tags">) {
  return item.pricingType === "Pro" || item.tags.some((t) => /pro/i.test(t));
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[220]">
      <div className="flex items-center gap-3 rounded-xl bg-black/90 text-white px-4 py-3 shadow-lg border border-white/10">
        <span className="text-sm font-semibold">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <IconX />
        </button>
      </div>
    </div>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm flex flex-col p-2 animate-pulse">
      {/* Preview placeholder */}
      <div className="h-[185px] bg-gray-100 rounded-xl" />

      {/* Footer row placeholder */}
      <div className="px-2 pt-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
          <div className="h-3 w-8 bg-gray-100 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 w-6 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Actions placeholder */}
      <div className="px-2 pb-2">
        <div className="w-full h-9 bg-gray-100 rounded-full" />
      </div>
    </article>
  );
}

// ── PreviewModal ──────────────────────────────────────────────────────────────
function getInitials(name: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function PreviewModal({
  item,
  onClose,
  onCopy,
  isCopying,
}: {
  item: ComponentItem;
  onClose: () => void;
  onCopy: (item: ComponentItem) => Promise<void>;
  isCopying: boolean;
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleCopy() {
    if (isCopying || isSuccess) return;
    await onCopy(item);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden font-manrope animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="text-[#9FE870] rotate-45 w-5 h-5 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">{item.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content - Image Preview */}
        <div className="px-6 py-4 relative overflow-hidden flex flex-col items-center">
          <div className="relative w-full h-[35vh] sm:h-[42vh] md:h-[46vh] max-h-[460px] min-h-[240px] rounded-xl border border-gray-100 overflow-hidden bg-[#FAFBFD] flex items-center justify-center">
            {item.previewImageUrl ? (
              <Image
                src={item.previewImageUrl}
                alt={item.name}
                fill
                priority
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No preview available
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2 shrink-0">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9FE870] to-[#54992e] flex items-center justify-center text-black font-extrabold text-xs shadow-sm shrink-0">
              {getInitials(item.createdBy?.name || "System")}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[0.88rem] text-gray-900 tracking-tight leading-tight">
                {item.createdBy?.name || "System Uploader"}
              </span>
              <span className="text-[0.72rem] text-gray-400 font-medium">Contributor</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-gray-700 hover:text-black hover:scale-105 active:scale-95 transition-all p-1"
              title="Share Component"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <div className="flex items-center gap-1.5 text-gray-700 hover:text-black hover:scale-105 transition-all cursor-pointer p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="font-semibold text-sm">10K</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isCopying || isSuccess}
              className={`ml-2 w-[120px] shrink-0 py-2 rounded-xl border text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${isSuccess
                ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20 scale-[0.98]"
                : "bg-white text-black border-black hover:bg-black hover:text-white active:scale-95 cursor-pointer"
                }`}
            >
              {isSuccess ? (
                <span className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polyline points="13.33 4 5.33 12 2.67 9.33" />
                  </svg>
                  Copied!
                </span>
              ) : isCopying ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 00-10 10h2a8 8 0 018-8V2z" />
                  </svg>
                  Copying...
                </span>
              ) : (
                <>
                  <Copy size={18} color="currentColor" strokeWidth={2} className="mr-0.5" />
                  Copy
                </>
              )}
            </button>
          </div>
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
  priority = false,
}: {
  item: { _id: string; name: string; previewImageUrl: string; tags: string[]; figmaDataBase64?: string; pricingType?: "Free" | "Pro"; designType?: "Wireframe" | "UI Design" };
  isCopying: boolean;
  onCopy: () => Promise<void>;
  onPreview: () => void;
  priority?: boolean;
}) {
  const isPro = isProComponent(item);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleCopy() {
    if (isCopying || isSuccess) return;
    await onCopy();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  }

  return (
    <article className="bg-white rounded-[20px] border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col p-2.5 font-manrope">
      {/* Preview */}
      <div
        className="relative cursor-pointer group/preview overflow-hidden h-[210px] w-full rounded-xl border-2 border-[#9FE870]/40 bg-[#F4F9ED]"
        onClick={onPreview}
        title="Click to preview"
      >
        {item.previewImageUrl ? (
          <Image
            src={item.previewImageUrl}
            alt={item.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover/preview:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No preview
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className="px-2 pt-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-semibold text-gray-800 text-[0.8rem] truncate">{item.name}</span>
          {isPro ? (
            <span className="flex items-center gap-1 text-[#9FE870] text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md shrink-0 tracking-wide">
              <Crown size={20} color="#d66a04" strokeWidth={2} />
              {/* PRO */}
            </span>
          ) : (
            <span className="text-[0.6rem] font-bold text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 shrink-0 uppercase tracking-wide">
              FREE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-[0.75rem]">
          <button type="button" className="hover:text-blue-500 transition-colors">
            <IconShare />
          </button>
          <div className="flex items-center gap-1 ml-1">
            <button type="button" className="hover:text-red-500 transition-colors">
              <IconHeart />
            </button>
            <span className="font-medium">10k</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-1 pb-1">
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopying || isSuccess}
          className={`w-full flex items-center justify-center gap-1.5 text-[0.85rem] font-semibold rounded-full py-2.5 transition-all duration-300 cursor-pointer font-manrope border ${isSuccess
            ? "bg-green-50 text-green-600 border-green-200"
            : "text-gray-700 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
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
              <Copy size={16} color="#000000" strokeWidth={1.25} />

              {isCopying ? "Copying…" : "Copy"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}

// ── QUERY CONFIG (shared) ─────────────────────────────────────────────────────
const STALE_TIME = 5 * 60 * 1000;  // 5 minutes — cached data treated as fresh
const GC_TIME = 10 * 60 * 1000; // 10 minutes — data kept in memory after unmount

function getDesignType(viewMode: ViewMode): "Wireframe" | "UI Design" {
  return viewMode === "wireframe" ? "Wireframe" : "UI Design";
}

function getPricingType(priceMode: PriceMode): "Free" | "Pro" | undefined {
  if (priceMode === "free") return "Free";
  if (priceMode === "pro") return "Pro";
  return undefined;
}

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

function buildQueryOptions(search: string, tag: string, viewMode: ViewMode, priceMode: PriceMode) {
  return {
    queryKey: ["components", "list", search, tag, viewMode, priceMode, PAGE_SIZE],
    queryFn: ({ pageParam }: { pageParam: { skip: number; limit: number } }) =>
      componentsApi.list(search, tag, 1, pageParam.limit, {
        designType: getDesignType(viewMode),
        pricingType: getPricingType(priceMode),
        skip: pageParam.skip,
      }),
    initialPageParam: { skip: 0, limit: PAGE_SIZE },
    getNextPageParam: (lastPage: PaginatedComponentResponse, allPages: PaginatedComponentResponse[]) => {
      const totalLoaded = allPages.reduce((acc, p) => acc + p.items.length, 0);
      return totalLoaded < lastPage.pagination.total ? { skip: totalLoaded, limit: 30 } : undefined;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  } as const;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ComponentsClient({
  initialPage,
}: {
  initialPage: PaginatedComponentResponse | null;
}) {
  const { user, setPricingModalOpen } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>(INITIAL_VIEW_MODE);
  const [priceMode, setPriceMode] = useState<PriceMode>(INITIAL_PRICE_MODE);
  const [platformMode, setPlatformMode] = useState<PlatformMode>(INITIAL_PLATFORM_MODE);
  const [activeId, setActiveId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [previewItem, setPreviewItem] = useState<null | ComponentItem>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim());
  const activeTag = activeCategory === "All" ? "" : activeCategory;
  const isInitialQuery =
    debouncedSearch === "" &&
    activeTag === "" &&
    viewMode === INITIAL_VIEW_MODE &&
    priceMode === INITIAL_PRICE_MODE;

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription", "checkAccess"],
    queryFn: () => paymentsApi.checkAccess(),
    enabled: !!user,
    staleTime: 60000,
  });

  const isProUser = subscriptionData?.isProUser ?? user?.isProUser ?? false;

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...buildQueryOptions(debouncedSearch, activeTag, viewMode, priceMode),
    initialData: isInitialQuery && initialPage
      ? {
        pages: [initialPage],
        pageParams: [{ skip: 0, limit: 15 }],
      }
      : undefined,
  });

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.pagination?.total ?? (initialPage?.pagination?.total || 0);

  // ── Prefetch a category on hover ───────────────────────────────────────────
  const prefetchCategory = useCallback(
    (cat: string) => {
      const tag = cat === "All" ? "" : cat;
      queryClient.prefetchInfiniteQuery({
        ...buildQueryOptions(debouncedSearch, tag, viewMode, priceMode),
        // Only prefetch if data isn't already cached / fresh
      });
    },
    [debouncedSearch, priceMode, queryClient, viewMode]
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
    if (platformMode === "web") {
      out = out.filter((i) => i.tags.some((t) => t.toLowerCase() === "web"));
    } else if (platformMode === "app") {
      out = out.filter((i) => i.tags.some((t) => t.toLowerCase() === "app"));
    }
    return out;
  }, [items, activeCategory, priceMode, viewMode, platformMode]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "600px 0px", threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ── Copy handler ───────────────────────────────────────────────────────────
  async function onCopy(item: ComponentItem) {
    if (isProComponent(item) && !isProUser) {
      showToast("Pro plan required to copy this component.");
      setPricingModalOpen(true);
      return;
    }

    setActiveId(item._id);
    try {
      const payload =
        item.figmaDataBase64 ||
        (
          await queryClient.fetchQuery({
            queryKey: ["components", "data", item._id],
            queryFn: () => componentsApi.getComponentData(item._id),
            staleTime: 10 * 60 * 1000,
          })
        ).figmaDataBase64;
      if (!payload) throw new Error("Component payload is missing.");
      await copyToFigma(payload, item.name);
    } catch (error) {
      console.error("Copy failed:", error);
    } finally {
      setActiveId(null);
    }
  }

  // How many skeleton cards to show
  const SKELETON_COUNT = PAGE_SIZE;
  const showSkeletons = isLoading;
  // isFetching (but not initial load) = stale re-fetch in background — keep old data, no skeleton
  const showStaleIndicator = isFetching && !isLoading;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#FAFAFA] relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />
      {/* ── Left Sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-gray-100 bg-[#FAFAFA] pt-4 font-manrope h-full">

        {/* Unlock Premium+ Block (Fixed at Top) */}
        <div className="mx-4 mb-6 bg-slate-100 rounded-xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] shrink-0">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <IconUnlock className="text-orange-500 w-5 h-5" />
            <span className="text-[#3B82F6] font-bold text-[0.95rem]">Unlock Premium+</span>
          </div>

          <div className="space-y-2 mb-4 ">
            <div className="flex items-start gap-2.5 bg-[#F0F6FF] border border-[#BFDBFE] rounded-lg p-2.5">
              <div className="mt-0.5 shrink-0 bg-[#3B82F6] rounded-full w-4 h-4 flex items-center justify-center text-white">
                <IconCheck />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] text-gray-800 font-bold leading-tight">Everything in Components</span>
                <span className="text-[0.65rem] text-gray-500 font-medium leading-tight">Unlimited Components</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border border-gray-200 rounded-lg p-2.5 bg-white">
              <div className="mt-0.5 shrink-0 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-gray-400">
                <IconCheck />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] text-gray-800 font-bold leading-tight">50+ Website UI Template</span>
                <span className="text-[0.65rem] text-gray-500 font-medium leading-tight">All future components</span>
              </div>
            </div>
          </div>

          <button className="w-full text-gray-900 border border-gray-300 bg-gray-50 hover:bg-black hover:text-white transition-all duration-100 cursor-pointer font-bold text-[0.75rem] py-3 rounded-lg transition-colors shadow-sm">
            BUY NOW !
          </button>
        </div>

        {/* Components section (Fixed in Position) */}
        <div className="px-6 flex items-center gap-2 mb-3 shrink-0">
          <span className="text-[#9FE870]"><IconLogoFourDots /></span>
          <span className="font-bold text-gray-800 text-[15px]">Components</span>
          <span className="ml-auto text-[0.65rem] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
            {total}
          </span>
        </div>

        {/* Scrollable Categories List Container (Hidden scrollbar) */}
        <div className="flex-1 overflow-y-auto pb-8 select-none no-scrollbar">
          <nav className="flex flex-col px-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                onMouseEnter={() => prefetchCategory(cat)}
                onFocus={() => prefetchCategory(cat)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[0.85rem] font-medium transition-colors cursor-pointer font-manrope ${activeCategory === cat
                  ? "text-black font-bold"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                {cat}
                <span className="text-gray-400"><IconChevron /></span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#FAFAFA]">
        {/* Page title section */}
        <div className="px-8 pt-4 pb-4">
          <h1 className="font-outfit font-bold text-[24px] text-[#161616] leading-tight">
            Browse Figma Components, Wireframe &amp; UI Design
          </h1>
          <p className="font-manrope font-normal text-[14px] text-gray-500 mt-1">
            {total > 0 ? `${total}+ Components` : "Components"}
          </p>
        </div>

        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-20 px-8 py-4 bg-[#FAFAFA] font-manrope">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 xl:gap-5">
            {/* View mode segmented control */}
            <div className="flex items-center bg-white border border-gray-200/60 rounded-lg p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("wireframe")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${viewMode === "wireframe"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                <IconWireframe />
                Wireframe
              </button>
              <button
                type="button"
                onClick={() => setViewMode("ui-design")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${viewMode === "ui-design"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                <IconPalette />
                UI Design
              </button>
            </div>

            {/* Platform segmented control */}
            <div className="flex items-center bg-white border border-gray-200/60 rounded-lg p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setPlatformMode("all")}
                className={`px-5 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${platformMode === "all"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPlatformMode("web")}
                className={`px-5 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${platformMode === "web"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                Web
              </button>
              <button
                type="button"
                onClick={() => setPlatformMode("app")}
                className={`px-5 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${platformMode === "app"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                App
              </button>
            </div>

            {/* Pricing segmented control */}
            <div className="flex items-center bg-white border border-gray-200/60 rounded-lg p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setPriceMode("free")}
                className={`px-6 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${priceMode === "free"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setPriceMode("pro")}
                className={`flex items-center gap-1 px-5 py-1.5 rounded-md text-[0.82rem] font-bold transition-all cursor-pointer ${priceMode === "pro"
                  ? "bg-[#79e041] text-black shadow-sm"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
                  }`}
              >
                <Crown size={16} color="black" strokeWidth={2} />
                Pro
              </button>
            </div>

            <div className="hidden lg:block flex-1" />

            {/* Search and Refresh Group */}
            <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
              {/* Search */}
              <div className="relative w-full lg:w-[260px] xl:w-[280px]">
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
                  className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200/60 rounded-lg text-[0.82rem] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition"
                  placeholder="Search components..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Refresh button */}
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center justify-center min-w-[80px] h-[36px] text-[0.82rem] font-bold text-gray-600 bg-[#F3F4F6] hover:bg-[#E5E7EB] px-4 rounded-lg transition-colors shrink-0 cursor-pointer"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Skeleton cards during initial load */}
            {showSkeletons &&
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}

            {/* Real cards — shown as soon as data arrives (or placeholderData) */}
            {!showSkeletons &&
              filtered.map((item, index) => (
                <ComponentCard
                  key={item._id}
                  item={item}
                  priority={index < 15}
                  isCopying={activeId === item._id}
                  onCopy={() => onCopy(item)}
                  onPreview={() =>
                    setPreviewItem(item)
                  }
                />
              ))}

            {isFetchingNextPage &&
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={`next-sk-${i}`} />
              ))}
          </div>

          {!isError && filtered.length > 0 && (
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {hasNextPage ? (
                <span className="text-xs font-semibold text-gray-400">
                  {isFetchingNextPage ? "Loading more..." : "Scroll for more"}
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-300">
                  You have reached the end
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <PreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onCopy={onCopy}
          isCopying={activeId === previewItem._id}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
