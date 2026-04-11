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

  async listMine(search = ""): Promise<PaginatedComponentResponse> {
    const response = await apiClient.get("/components/my", {
      params: {
        q: search || undefined,
      },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<ComponentItem> {
    const response = await apiClient.get(`/components/${id}`);
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

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/components/${id}`);
  },
};
