import { apiClient } from "./client";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  company?: string;
  country: string;
  message: string;
  status: "submitted" | "emailed" | "failed";
  createdAt: string;
}

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  country: string;
  message: string;
}

export const contactApi = {
  async create(input: ContactInput): Promise<{ id: string; status: ContactMessage["status"]; createdAt: string }> {
    const response = await apiClient.post("/contacts", input);
    return response.data.data;
  },

  async listMine(): Promise<ContactMessage[]> {
    const response = await apiClient.get("/contacts/mine");
    return response.data.data.items;
  },
};
