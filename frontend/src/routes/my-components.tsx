import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { componentsApi } from "../api/components";
import { copyToFigma } from "../lib/clipboard";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/my-components")({
  component: MyComponentsPage,
});

// ── icons ─────────────────────────────────────────────────────────────────────
function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 11V2.5A1.5 1.5 0 014.5 1H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10H3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="30" height="30" rx="6" stroke="#D1D5DB" strokeWidth="2" />
      <path d="M13 20h14M20 13v14" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── DeleteConfirmModal ─────────────────────────────────────────────────────────
function DeleteConfirmModal({
  name,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[1rem] font-bold text-gray-900 mb-1">Delete component?</h3>
        <p className="text-[0.84rem] text-gray-500 mb-5">
          <span className="font-semibold text-gray-700">"{name}"</span> will be permanently removed.
          This action cannot be undone.
        </p>
        <div className="flex gap-2.5 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-[0.83rem] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-[0.83rem] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MyComponentsPage ───────────────────────────────────────────────────────────
function MyComponentsPage() {
  const { user, setLoginModalOpen } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-components", search],
    queryFn: () => componentsApi.listMine(search),
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.pagination?.total ?? items.length;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => componentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-components"] });
      setDeleteTarget(null);
    },
  });

  async function handleCopy(id: string, name: string, figmaDataBase64?: string) {
    setCopyStatus("");
    setCopyingId(id);
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
      if (!payload) throw new Error("No Figma payload found.");
      await copyToFigma(payload, name);
      setCopyStatus(`✓ Copied "${name}"`);
    } catch (err) {
      setCopyStatus(err instanceof Error ? err.message : "Copy failed.");
    } finally {
      setCopyingId(null);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500 font-medium">Please log in to view your components.</p>
        <button
          type="button"
          onClick={() => setLoginModalOpen(true)}
          className="bg-[#8A2BE2] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7b22cc] transition-colors"
          style={{ color: "#fff" }}
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[1.5rem] font-bold text-gray-900">My Components</h1>
          <p className="text-[0.84rem] text-gray-500 mt-0.5">
            {total > 0 ? `${total} component${total !== 1 ? "s" : ""}` : "No components yet"}
          </p>
        </div>

        <Link
          to="/add-component"
          className="inline-flex items-center gap-2 bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-4 py-2.5 rounded-xl text-[0.85rem] font-semibold transition-colors shadow-sm"
          style={{ color: "#fff" }}
        >
          <IconPlus />
          Add Component
        </Link>
      </div>

      {/* Search + status */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-full max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch />
          </span>
          <input
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-[0.84rem] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
            placeholder="Search your components…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {copyStatus && (
          <span className="text-[0.78rem] text-gray-600 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5">
            {copyStatus}
          </span>
        )}
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
          Loading your components…
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-24 text-red-400 text-sm">
          Could not load your components.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
          <IconBox />
          <p className="text-gray-500 font-medium">You haven't uploaded any components yet.</p>
          <Link
            to="/add-component"
            className="inline-flex items-center gap-2 bg-[#8A2BE2] hover:bg-[#7b22cc] text-white px-5 py-2.5 rounded-xl text-[0.85rem] font-semibold transition-colors"
            style={{ color: "#fff" }}
          >
            <IconPlus />
            Upload your first component
          </Link>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Preview */}
              <div
                className="h-[170px] bg-[#F3F3F6] bg-center bg-contain bg-no-repeat"
                style={item.previewImageUrl ? { backgroundImage: `url(${item.previewImageUrl})` } : {}}
                aria-label={item.name}
              >
                {!item.previewImageUrl && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No preview
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-4 pt-3 pb-1">
                <p className="font-semibold text-gray-800 text-[0.88rem] truncate">{item.name}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-500 text-[0.68rem] font-medium px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[0.68rem] text-gray-400">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-2 pb-3 mt-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(item._id, item.name, item.figmaDataBase64)}
                  disabled={copyingId === item._id}
                  className="flex-1 flex items-center justify-center gap-1.5 text-[0.78rem] font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2 transition-colors disabled:opacity-60"
                >
                  <IconCopy />
                  {copyingId === item._id ? "Copying…" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ id: item._id, name: item.name })}
                  className="flex items-center justify-center gap-1.5 px-3 text-[0.78rem] font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl py-2 transition-colors"
                  aria-label="Delete component"
                >
                  <IconTrash />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.name}
          onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
