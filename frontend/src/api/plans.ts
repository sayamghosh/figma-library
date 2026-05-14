import { apiClient } from "./client";

export interface Plan {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  durationDays: number;
  componentLimit: number;
  isActive: boolean;
  sortOrder: number;
  features: string[];
}

export const plansApi = {
  async getAllPlans(): Promise<Plan[]> {
    const response = await apiClient.get("/plans");
    return response.data.data;
  },

  async getPlanById(id: string): Promise<Plan> {
    const response = await apiClient.get(`/plans/${id}`);
    return response.data.data;
  },
};