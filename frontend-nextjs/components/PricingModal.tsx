"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { plansApi, type Plan } from "../api/plans";
import { paymentsApi } from "../api/payments";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user, setLoginModalOpen } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: plansApi.getAllPlans,
    enabled: isOpen,
  });

  const { data: subscriptionData, refetch: refetchSubscription } = useQuery({
    queryKey: ["subscription", "checkAccess"],
    queryFn: () => paymentsApi.checkAccess(),
    enabled: isOpen && !!user,
  });

  useEffect(() => {
    if (isOpen && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasActiveSubscription = subscriptionData?.isProUser && subscriptionData?.subscription;
  const subscription = subscriptionData?.subscription;

  const handlePlanSelect = async (plan: Plan) => {
    if (!user) {
      setLoginModalOpen(true);
      onClose();
      return;
    }

    // If user already has subscription, ask for confirmation
    if (hasActiveSubscription) {
      const confirmUpgrade = window.confirm(
        "You already have an active subscription. Upgrading will replace your current plan. Continue?"
      );
      if (!confirmUpgrade) return;
    }

    setSelectedPlan(plan);
    setError("");
    setLoading(true);

    try {
      const orderData = await paymentsApi.createOrder(plan._id);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Figcomponents Pro",
        description: `Subscribe to ${orderData.planName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await paymentsApi.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              plan._id
            );
            await refetchSubscription(); // Refresh subscription data
            alert("Payment successful! You now have Pro access.");
            onClose();
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#8A2BE2",
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();

      razorpay.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
      });
    } catch (err: any) {
      if (err.message === "SUBSCRIPTION_EXISTS") {
        setError("You already have an active subscription.");
      } else {
        setError(err.message || "Failed to create payment. Please try again.");
      }
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Current Subscription Status */}
          {user && hasActiveSubscription && subscription && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-purple-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Active Pro Subscription
                  </h3>
                  <p className="text-sm text-purple-700 mt-1">
                    {subscription.componentCountUsed} / {subscription.maxComponents} components used
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">
                    <span className="font-medium">Expires:</span> {formatDate(subscription.endDate)}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">
                    {subscription.maxComponents - subscription.componentCountUsed} components remaining
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${(subscription.componentCountUsed / subscription.maxComponents) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Show login prompt for non-authenticated users */}
          {!user && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-blue-800">
                <button
                  onClick={() => { onClose(); setLoginModalOpen(true); }}
                  className="font-semibold underline hover:text-blue-900"
                >
                  Sign in
                </button>{" "}
                to purchase a Pro subscription
              </p>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {hasActiveSubscription ? "Upgrade Your Plan" : "Upgrade to Pro"}
            </h2>
            <p className="text-gray-500">
              {hasActiveSubscription
                ? "Get more components with an upgraded plan"
                : "Unlock premium components and take your designs to the next level"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading plans...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {plans?.map((plan) => (
                <div
                  key={plan._id}
                  className={`relative border-2 rounded-xl p-6 transition-all ${
                    plan.name === "pro_ultimate"
                      ? "border-purple-500 bg-purple-50/30"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {plan.name === "pro_ultimate" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.displayName}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price / 100}</span>
                    <span className="text-gray-500 text-sm"> / {plan.durationDays} days</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={loading && selectedPlan?._id === plan._id}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      plan.name === "pro_ultimate"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading && selectedPlan?._id === plan._id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : hasActiveSubscription ? (
                      `Upgrade to ₹${plan.price / 100}`
                    ) : (
                      `Pay ₹${plan.price / 100}`
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>30-day money back</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}