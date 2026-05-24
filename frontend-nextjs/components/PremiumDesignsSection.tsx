"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { componentsApi } from "../api/components";
import { useAuth } from "../context/AuthContext";
import { plansApi } from "../api/plans";
import { paymentsApi } from "../api/payments";
import { Check, ArrowRight, Crown, Zap, ArrowUpRight, AlignLeft, Wallet, Briefcase, MoreHorizontal, RefreshCw } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function IntegrationVisual() {
  const { data } = useQuery({
    queryKey: ["latestComponent"],
    queryFn: () => componentsApi.list(),
  });

  const latestComponent = data?.items?.[0];

  return (
    <div className="relative min-h-[430px]">
      {latestComponent?.previewImageUrl ? (
        <img
          src={latestComponent.previewImageUrl}
          alt={latestComponent.name || "Latest component"}
          className="absolute left-0 top-0 h-[390px] w-[76%] rounded-[10px] object-contain bg-white border border-gray-100 shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-2"
        />
      ) : (
        <div className="absolute left-0 top-0 h-[390px] w-[76%] rounded-[10px] bg-[linear-gradient(90deg,#111_0_12%,#d8d8d8_12%_82%,#9FE870_82%_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.08)]" />
      )}
      <div className="absolute bottom-3 right-8 w-[230px] rounded-2xl bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[15px] font-medium">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#b4f090] text-[#2c5114]"><AlignLeft size={14} strokeWidth={2.5} /></span>
            Components
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-gray-100 bg-gray-50 text-gray-400"><MoreHorizontal size={14} /></span>
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <p className="text-[24px] font-semibold text-[#111111]">1000+</p>
          <span className="text-[10px] font-semibold text-[#2c5114] bg-[#eafaf1] px-1.5 py-0.5 rounded flex items-center gap-0.5"><ArrowUpRight size={15} strokeWidth={3}/></span>
          <span className="text-[12px] text-[#999999] font-medium">components</span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-[#999999]">
          <RefreshCw size={15} />
          Recent Uploaded
        </p>
      </div>
      <Link href="/components" className="absolute left-14 top-[-18px] flex items-center rounded-full bg-white py-1.5 pr-5 pl-1.5 text-[13px] shadow-md group cursor-pointer">
        <span className="flex items-center gap-1 rounded-full bg-[#b4f090] px-3 py-1 font-bold text-[#2c5114] hover:bg-black hover:text-white"><ArrowUpRight size={14} strokeWidth={3}/> view</span>
        <span className="ml-3 text-[#6f6f6f] font-medium text-[11px] hover:text-black transition-colors">Recent Uploaded</span>
      </Link>
    </div>
  );
}

interface PlanCardProps {
  dark?: boolean;
  title: string;
  price: string;
  period: string;
  icon: any;
  isSelected: boolean;
  onClick: () => void;
  features: string[];
  description: string;
  onActionClick: (e: React.MouseEvent) => void;
  actionLoading?: boolean;
}

function PlanCard({
  dark = false,
  title,
  price,
  period,
  icon: Icon,
  isSelected,
  onClick,
  features,
  description,
  onActionClick,
  actionLoading,
}: PlanCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-500 overflow-hidden h-full min-h-[380px] ${dark ? "bg-black text-white" : "bg-[#f5f6f8] text-[#111111]"} rounded-[20px] p-10 ${isSelected ? "ring-2 ring-[#9FE870] ring-offset-2" : "hover:scale-[1.02]"}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={dark ? "text-[#f39c12]" : "text-[#5dade2]"} size={22} fill="currentColor" />
        <h3 className="text-[22px] font-bold">{title}</h3>
      </div>
      <div className="mt-6 flex items-baseline gap-1">
        <p className={`text-[clamp(2.5rem,4vw,3.8rem)] font-bold leading-none ${dark ? "text-[#9FE870]" : "text-[#111111]"}`}>
          {price}
        </p>
        <span className={`text-[18px] font-medium ${dark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>/{period}</span>
      </div>
      <p className={`mt-10 max-w-[240px] text-[16px] leading-[1.6] font-medium ${dark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>
        {description}
      </p>
      <div className="mt-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActionClick(e);
          }}
          disabled={actionLoading}
          className={`group inline-flex h-[56px] items-center gap-5 rounded-full py-2 pl-8 pr-2 text-[15px] font-bold transition-all disabled:opacity-50 cursor-pointer ${
            dark 
              ? "bg-[#9FE870] text-black hover:bg-[#8edb5f] shadow-[0_4px_14px_rgba(159,232,112,0.3)]" 
              : "bg-[#111111] text-white hover:bg-black shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
          }`}
        >
          {actionLoading ? "Processing..." : "Buy Now"}
          <span className={`grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${dark ? "bg-white text-black" : "bg-[#9FE870] text-black"}`}>
            <ArrowRight size={20} strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {isSelected && (
        <div className={`mt-10 pt-10 border-t lg:absolute lg:right-12 lg:top-1/2 lg:mt-0 lg:w-[48%] lg:-translate-y-1/2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 animate-in fade-in slide-in-from-right-4 duration-500 ${dark ? "border-white/10" : "border-black/10"}`}>
          <ul className={`space-y-6 text-[15px] font-medium ${dark ? "text-white/90" : "text-black/80"}`}>
            {features.slice(0, 6).map((item) => (
              <li key={item} className="flex items-center gap-4">
                <Check className={dark ? "text-[#9FE870]" : "text-black"} size={18} strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PremiumDesignsSection() {
  const { user, setLoginModalOpen } = useAuth();
  const [selectedPlanName, setSelectedPlanName] = useState<"basic" | "advanced">("advanced");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingPlanName, setPendingPlanName] = useState<string | null>(null);

  // Fetch plans from DB
  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: plansApi.getAllPlans,
  });

  const proStarter = plansData?.find((p) => p.name === "pro_starter");
  const proUltimate = plansData?.find((p) => p.name === "pro_ultimate");

  const { refetch: refetchSubscription } = useQuery({
    queryKey: ["subscription", "checkAccess"],
    queryFn: () => paymentsApi.checkAccess(),
    enabled: !!user,
  });

  // Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const startPayment = useCallback(async (plan: any) => {
    setError("");
    setCheckoutLoading(true);

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
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
            alert("Payment verification failed. Please contact support.");
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
        const errMsg = `Payment failed: ${response.error.description}`;
        setError(errMsg);
        alert(errMsg);
      });
    } catch (err: any) {
      let errMsg = "";
      errMsg = err.message === "SUBSCRIPTION_EXISTS"
        ? "Failed to create payment. Please try again."
        : err.message || "Failed to create payment. Please try again.";
      setError(errMsg);
      alert(errMsg);
    } finally {
      setCheckoutLoading(false);
    }
  }, [refetchSubscription, user]);

  const handlePlanSelect = async (planName: string) => {
    const plan = plansData?.find((p) => p.name === planName);

    if (!plan) {
      alert("This plan is not available yet.");
      return;
    }

    if (!user) {
      setPendingPlanName(plan.name);
      setLoginModalOpen(true);
      return;
    }

    await startPayment(plan);
  };

  useEffect(() => {
    if (!user || !pendingPlanName || checkoutLoading) return;
    const pendingPlan = plansData?.find((p) => p.name === pendingPlanName);
    if (!pendingPlan) return;
    setPendingPlanName(null);
    startPayment(pendingPlan);
  }, [checkoutLoading, pendingPlanName, plansData, startPayment, user]);

  const basicFeatures = [
    "Access to core features",
    "Standard template library",
    "Community support",
    "Basic responsive layouts",
    "Export to PNG/JPG",
    "1 project workspace",
  ];

  const advancedFeatures = [
    "Save Time, Launch Faster",
    "Professional Quality Design",
    "Fully Customizable",
    "Auto Layout & Responsive Ready",
    "Scalable Design System",
    "Regular Updates & Support",
  ];

  return (
    <>
      <section className="w-full bg-[#f3f4f6] px-5 pt-12 pb-12 sm:px-8 lg:pt-16 lg:pb-16">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-16 lg:grid-cols-2">
          <IntegrationVisual />
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
              recent component
            </p>
            <h2 className="max-w-[690px] font-outfit text-[clamp(2.3rem,3.6vw,4.2rem)] font-medium leading-tight text-[#111111]">
              Create a website in minutes
            </h2>
            <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
              Build and launch fast with ready-made components, smart tools, <br /> and effortless customization—no long dev cycles needed.
            </p>

            <div className="mt-12 space-y-9">
              <div className="flex gap-7 items-start">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#e5e7eb] bg-white text-[#6f6f6f]">
                  <Wallet size={24} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-[20px] font-semibold text-[#111111]">Ready-Made Components</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6f6f6f]">
                    Use pre-built UI blocks to design and launch <br /> websites quickly without starting from scratch.
                  </p>
                </div>
              </div>

              <div className="flex gap-7 items-start">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#e5e7eb] bg-white text-[#6f6f6f]">
                  <Briefcase size={24} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-[20px] font-semibold text-[#111111]">Smart Customization Tools</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6f6f6f]">
                    Easily edit layouts, styles, and content with intuitive <br /> controls for a fully personalized website.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/components" className="mt-12 inline-flex h-[58px] items-center gap-5 rounded-full bg-black py-2 pl-8 pr-2 text-[15px] font-semibold text-white group">
              Browse Components
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9FE870] text-black transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={20} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="w-full bg-white px-5 pt-12 pb-12 sm:px-8 lg:pt-16 lg:pb-16">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mx-auto max-w-[780px] text-center">
            <p className="mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-black">
              Pricing & plans
            </p>
            <h2 className="mt-8 font-outfit text-[clamp(2.3rem,3.6vw,4.2rem)] font-medium leading-[1.1] text-[#111111]">
              Developing strong ideas into relatable and concrete
            </h2>
          </div>

          {error && (
            <div className="mt-8 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center max-w-[600px] mx-auto">
              {error}
            </div>
          )}

          <div className={`mt-16 grid gap-8 transition-all duration-500 lg:items-stretch ${selectedPlanName === "basic" ? "lg:grid-cols-[2.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_2.1fr]"}`}>
            <PlanCard 
              title="Basic plan" 
              price={proStarter ? `₹ ${Math.floor(proStarter.price / 100)}` : "₹ 99"}
              period={proStarter ? `${proStarter.durationDays} Days` : "180 Days"}
              icon={Zap} 
              isSelected={selectedPlanName === "basic"}
              onClick={() => setSelectedPlanName("basic")}
              features={proStarter?.features || basicFeatures}
              description={proStarter?.description || "Simple structures, leading to a focus on user experience."}
              onActionClick={() => handlePlanSelect("pro_starter")}
              actionLoading={checkoutLoading && pendingPlanName === "pro_starter"}
            />
            <PlanCard 
              dark 
              title="Advanced plan" 
              price={proUltimate ? `₹ ${Math.floor(proUltimate.price / 100)}` : "₹ 199"}
              period={proUltimate ? `${proUltimate.durationDays} Days` : "180 Days"}
              icon={Crown} 
              isSelected={selectedPlanName === "advanced"}
              onClick={() => setSelectedPlanName("advanced")}
              features={proUltimate?.features || advancedFeatures}
              description={proUltimate?.description || "Highly customized layout to help you stand out."}
              onActionClick={() => handlePlanSelect("pro_ultimate")}
              actionLoading={checkoutLoading && pendingPlanName === "pro_ultimate"}
            />
          </div>

          {/* Centered Try for free Button */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/components"
              className="group inline-flex h-[56px] items-center gap-5 rounded-full border border-gray-300 bg-white pl-8 pr-2 text-[15px] font-bold text-black shadow-sm transition-all hover:bg-gray-50 hover:border-black cursor-pointer"
            >
              Try for free
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9FE870] text-black transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={20} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
