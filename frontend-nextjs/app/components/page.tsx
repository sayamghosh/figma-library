import { componentsApi } from "../../api/components";
import type { PaginatedComponentResponse } from "../../lib/types";
import ComponentsClient from "./client";

export const dynamic = "force-dynamic";

export default async function ComponentsPage() {
  let initialPage: PaginatedComponentResponse | null = null;
  let initialTags: string[] = [];

  try {
    const [pageRes, tagsRes] = await Promise.allSettled([
      componentsApi.list("", "", 1, 15, {
        designType: "UI Design",
      }),
      componentsApi.getTags(),
    ]);

    if (pageRes.status === "fulfilled") {
      initialPage = pageRes.value;
    } else {
      console.error("Failed to load initial components page list:", pageRes.reason);
    }

    if (tagsRes.status === "fulfilled") {
      initialTags = tagsRes.value;
    } else {
      console.error("Failed to load initial tags list:", tagsRes.reason);
    }
  } catch (error) {
    console.error("Failed to load initial components page data:", error);
  }

  return <ComponentsClient initialPage={initialPage} initialTags={initialTags} />;
}
