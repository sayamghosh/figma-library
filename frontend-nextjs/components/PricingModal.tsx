"use client";
import { useState, useEffect, useCallback } from "react";
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
  const [pendingPlanName, setPendingPlanName] = useState<string | null>(null);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

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

  useEffect(() => {
    if (!isOpen) {
      setPendingPlanName(null);
      setShowLoginNotice(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasActiveSubscription = subscriptionData?.isProUser && subscriptionData?.subscription;

  const startPayment = useCallback(async (plan: Plan) => {
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
            await refetchSubscription();
            alert("Payment successful! You now have Pro access.");
            onClose();
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#2563EB",
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
  }, [hasActiveSubscription, onClose, refetchSubscription, user]);

  const handlePlanSelect = async (planName: string) => {
    const plan = plans?.find((p) => p.name === planName);

    if (!plan) {
      alert("This plan is not available yet.");
      return;
    }

    if (!user) {
      setPendingPlanName(plan.name);
      setShowLoginNotice(true);
      setLoginModalOpen(true);
      return;
    }

    await startPayment(plan);
  };

  useEffect(() => {
    if (!user || !pendingPlanName || loading) return;
    const pendingPlan = plans?.find((p) => p.name === pendingPlanName);
    if (!pendingPlan) return;
    setPendingPlanName(null);
    setShowLoginNotice(false);
    startPayment(pendingPlan);
  }, [loading, pendingPlanName, plans, startPayment, user]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[950px] bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 p-2 text-gray-400 hover:text-gray-900 cursor-pointer"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {showLoginNotice && !user && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center">
            Please log in to continue with your selected plan.
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 items-center lg:items-stretch">
            {/* Left Column */}
            <div className="flex-1 max-w-[280px] flex flex-col justify-center text-center lg:text-left">
              <h3 className="text-[#2563EB] font-bold text-xl mb-2">Go Pro</h3>
              <h2 className="text-2xl md:text-2xl font-extrabold text-[#0B1527] leading-[1.2] tracking-tight mb-4">
                The right plan can change your work life
              </h2>
              <p className="text-[#64748B] text-sm mb-6 leading-[1.6]">
                Clarity gives you the blocks & components you need to create a truly professional website, landing page or admin panel for your SaaS.
              </p>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Trusted by Customers</h4>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <div className="flex text-[#FFC107] text-xl gap-1">
                    ★★★★★
                  </div>
                  <span className="text-gray-600 font-medium mt-1 text-sm">4.4/5</span>
                </div>
              </div>
            </div>

            {/* Right Column - Cards */}
            <div className="flex-[1.4] w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BASIC Card */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.16)] p-6 flex flex-col border border-gray-100">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-1 text-gray-900">
                  BASIC
                </h3>
                <p className="text-gray-400 text-xs text-center mb-4">Best for startups</p>

                <div className="bg-[#FAFAFA] rounded-2xl py-4 flex flex-col items-center justify-center mb-6">
                  <div className="flex items-baseline text-slate-900">
                    <span className="text-lg font-bold align-top relative -top-2">₹</span>
                    <span className="text-[40px] font-black tracking-tight leading-none">99</span>
                    <span className="text-xl font-bold ml-1 text-slate-900">/</span>
                  </div>
                  <span className="text-[#94A3B8] text-xs font-medium mt-1">180 Days</span>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">100 Components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">100 Pro Components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">Upgrade facility</span>
                  </li>
                </ul>

                <button
                  onClick={() => handlePlanSelect("pro_starter")}
                  disabled={loading}
                  className="bg-[#9FE870] hover:bg-[#8edb5f] text-black w-full cursor-pointer rounded-xl py-3 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {loading && selectedPlan?.name === "pro_starter" ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {/* ADVANCE Card */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.16)] p-6 flex flex-col border border-gray-100">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-center mb-1 text-gray-900">
                  ADVANCE
                </h3>
                <p className="text-gray-400 text-xs text-center mb-4">Best for medium</p>

                <div className="bg-[#FAFAFA] rounded-2xl py-4 flex flex-col items-center justify-center mb-6">
                  <div className="flex items-baseline text-slate-900">
                    <span className="text-lg font-bold align-top relative -top-2">₹</span>
                    <span className="text-[40px] font-black tracking-tight leading-none">199</span>
                    <span className="text-xl font-bold ml-1 text-slate-900">/</span>
                  </div>
                  <span className="text-[#94A3B8] text-xs font-medium mt-1">180 Days</span>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">250 Components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">250 Pro Components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#334155] text-sm font-medium">Upgrade facility</span>
                  </li>
                </ul>

                <button
                  onClick={() => handlePlanSelect("pro_ultimate")}
                  disabled={loading}
                  className="bg-[#9FE870] hover:bg-[#8edb5f] text-black w-full cursor-pointer rounded-xl py-3 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {loading && selectedPlan?.name === "pro_ultimate" ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Dark Card */}
          <div className="bg-[#111111] rounded-[24px] px-6 md:px-8 py-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
            <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">Unlimited components</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">Use Free & Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">365 Days Validity</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">Access all Premium+</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">Use all Components</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm font-medium tracking-wide">365 Days Validity</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end w-full md:w-auto">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#82F24E] text-[40px] font-black leading-none tracking-tight">₹399</span>
                <span className="text-gray-300 text-sm font-medium">/ 365 Days</span>
              </div>
              <button
                onClick={() => handlePlanSelect("pro_annual")}
                disabled={loading}
                className="bg-white text-slate-900 px-15 py-3 rounded-xl font-bold text-sm w-full md:w-auto hover:bg-[#9FE870] cursor-pointer transition-colors disabled:opacity-50"
              >
                Grab it !
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
