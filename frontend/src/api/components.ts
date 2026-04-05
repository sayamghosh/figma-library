import { apiClient } from "./client";
import type { ComponentItem, PaginatedComponentResponse } from "../lib/types";

export const componentsApi = {
  async list(search = "", tag = ""): Promise<PaginatedComponentResponse> {
    const response = await apiClient.get("/components", {
      params: {
        q: search || undefined,
        tag: tag || undefined,
      },
    });
    return response.data.data;
  },

  async create(input: {
    name: string;
    description: string;
    tags: string[];
    previewImageUrl: string;
    figmaDataBase64: string;
  }): Promise<ComponentItem> {
    const response = await apiClient.post("/components", input);
    return response.data.data;
  },
};
