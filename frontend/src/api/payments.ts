import { apiClient } from "./client";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  planId: string;
  planName: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}

export interface SubscriptionData {
  status: string;
  endDate: string;
  maxComponents: number;
  componentCountUsed: number;
  remainingComponents: number;
}

export interface CheckAccessResponse {
  hasAccess: boolean;
  isProUser: boolean;
  subscription: SubscriptionData | null;
}

export const paymentsApi = {
  async createOrder(planId: string): Promise<CreateOrderResponse> {
    const response = await apiClient.post("/payments/create-order", { planId });
    return response.data.data;
  },

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    planId: string
  ): Promise<PaymentVerificationResponse> {
    const response = await apiClient.post("/payments/verify", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      planId,
    });
    return response.data;
  },

  async checkAccess(): Promise<CheckAccessResponse> {
    const response = await apiClient.get("/payments/check-access");
    return response.data.data;
  },

  async getCurrentSubscription(): Promise<any> {
    const response = await apiClient.get("/subscriptions/current");
    return response.data.data;
  },

  async cancelSubscription(): Promise<void> {
    await apiClient.post("/subscriptions/cancel");
  },
};