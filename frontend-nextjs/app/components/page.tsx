import { componentsApi } from "../../api/components";
import type { PaginatedComponentResponse } from "../../lib/types";
import ComponentsClient from "./client";

export const dynamic = "force-dynamic";

export default async function ComponentsPage() {
  let initialPage: PaginatedComponentResponse | null = null;

  try {
    initialPage = await componentsApi.list("", "", 1, 15, {
      designType: "UI Design",
    });
  } catch (error) {
    console.error("Failed to load initial components page:", error);
  }

  return <ComponentsClient initialPage={initialPage} />;
}
