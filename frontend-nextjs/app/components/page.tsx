import { componentsApi } from "../../api/components";
import type { PaginatedComponentResponse } from "../../lib/types";
import ComponentsClient from "./client";

export const dynamic = "force-dynamic";

const EMPTY_COMPONENTS_PAGE: PaginatedComponentResponse = {
  items: [],
  pagination: {
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  },
};

export default async function ComponentsPage() {
  let initialPage = EMPTY_COMPONENTS_PAGE;

  try {
    initialPage = await componentsApi.list("", "", 1, 15, {
      designType: "UI Design",
    });
  } catch (error) {
    console.error("Failed to load initial components page:", error);
  }

  return <ComponentsClient initialPage={initialPage} />;
}
