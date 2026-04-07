import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { componentsApi } from "../../api/components";
import { copyToFigma } from "../../lib/clipboard";

export const Route = createFileRoute("/components/")({
  component: ComponentsPage,
});

function ComponentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["components", "list", search],
    queryFn: () => componentsApi.list(search),
    staleTime: 2 * 60 * 1000,
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  async function onCopy(id: string, name: string, figmaDataBase64?: string) {
    setStatus("");
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
      if (!payload) {
        throw new Error("Component payload is missing.");
      }
      const mode = await copyToFigma(payload, name);
      setStatus(
        mode === "copied-binary"
          ? `Copied ${name} with binary payload.`
          : `Copied ${name} with HTML fallback payload.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Copy failed.");
    } finally {
      setActiveId(null);
    }
  }

  return (
    <section>
      <div className="section-head">
        <h2>Component Library</h2>
        <button type="button" className="secondary-btn" onClick={() => refetch()}>
          Refresh
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search components by name or tag"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {status ? <p className="status-text">{status}</p> : null}

      {isLoading ? <p>Loading components...</p> : null}
      {isError ? <p className="error-text">Could not load components from API.</p> : null}

      <div className="component-grid">
        {items.map((item) => (
          <article key={item._id} className="component-card">
            <div
              className="preview-box"
              style={{ backgroundImage: `url(${item.previewImageUrl})` }}
              aria-label={item.name}
            />
            <div className="component-content">
              <h3>{item.name}</h3>
              <p>{item.description || "No description"}</p>
              <div className="tag-list">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="primary-btn"
              type="button"
              disabled={activeId === item._id}
              onClick={() => onCopy(item._id, item.name, item.figmaDataBase64)}
            >
              {activeId === item._id ? "Copying..." : "Copy to Figma"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
