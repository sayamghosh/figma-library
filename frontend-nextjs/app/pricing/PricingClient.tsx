"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import fcLogo from "../assets/fc-logo.png";
import type { Plan } from "../../api/plans";
import { paymentsApi } from "../../api/payments";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 2-2 58 58 0 0 1 15 0 2 2 0 0 1 2 2 24 24 0 0 1 0 10 2 2 0 0 1-2 2 58 58 0 0 1-15 0 2 2 0 0 1-2-2Z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

interface PricingCardProps {
  plan: Plan;
  highlighted: boolean;
  onGetStarted: () => void;
}

function PricingCard({ plan, highlighted, onGetStarted }: PricingCardProps) {
  const price = Math.floor(plan.price / 100);
  const duration = `${plan.durationDays} Days`;
  const displayName = plan.displayName || plan.name;
  const items = plan.features || [];

  return (
    <article
      className={
        highlighted
          ? "flex min-h-[600px] flex-col rounded-[24px] bg-[#054316] p-8 text-white shadow-[0_20px_40px_rgba(5,67,22,0.3)] md:-mt-8 border border-[#06501a] relative transition-transform hover:scale-[1.02] duration-300"
          : "flex min-h-[560px] flex-col rounded-[24px] bg-white p-8 text-[#0B1527] border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform hover:scale-[1.02] duration-300"
      }
    >
      <h2 className="text-[24px] font-bold tracking-tight">{displayName}</h2>
      <p
        className={
          highlighted
            ? "mt-3 text-[14px] leading-[1.5] text-white/80"
            : "mt-3 text-[14px] leading-[1.5] text-[#64748B]"
        }
      >
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[52px] font-extrabold tracking-tight leading-none">
          &#8377;{price}
        </span>
        <span
          className={
            highlighted
              ? "text-[14px] font-medium text-white/60"
              : "text-[14px] font-medium text-[#94A3B8]"
          }
        >
          / {duration}
        </span>
      </div>

      <button
        type="button"
        onClick={onGetStarted}
        className={
          highlighted
            ? "mt-8 w-full rounded-[12px] bg-white py-3.5 text-[14px] font-bold text-[#2563EB] shadow-md hover:bg-slate-50 transition-colors cursor-pointer"
            : "mt-8 w-full rounded-[12px] border-2 border-[#2563EB] bg-white py-3 text-[14px] font-bold text-[#2563EB] hover:bg-blue-50/50 transition-colors cursor-pointer"
        }
      >
        Get Started Now
      </button>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`} className="flex items-center gap-3 text-[14px] font-medium">
            <span
              className={
                highlighted
                  ? "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#054316]"
                  : "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E5EDFF] text-[#2563EB]"
              }
            >
              <Check size={14} strokeWidth={3} />
            </span>
            <span className={highlighted ? "text-white" : "text-[#334155]"}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SpatialitySection() {
  return (
    <section className="mx-auto mt-[150px] w-full max-w-[1320px] px-5">
      <h2 className="text-center text-[34px] font-extrabold tracking-[-0.035em] text-black md:text-[42px]">
        What&apos;s our spatiality!
      </h2>

      <div
        className="mt-12 overflow-hidden rounded-[7px] border border-[#e2e2e2] px-5 py-[70px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:py-[78px]"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: [
            "radial-gradient(ellipse 46% 67% at 100% 0%, rgba(159,232,112,0.98) 0%, rgba(171,239,127,0.9) 20%, rgba(213,255,188,0.54) 43%, rgba(255,255,255,0) 71%)",
            "radial-gradient(ellipse 50% 72% at 0% 100%, rgba(159,232,112,0.98) 0%, rgba(176,242,134,0.84) 24%, rgba(220,255,199,0.5) 46%, rgba(255,255,255,0) 74%)",
            "radial-gradient(ellipse 30% 45% at 18% 53%, rgba(226,255,210,0.34) 0%, rgba(255,255,255,0) 72%)",
            "radial-gradient(ellipse 38% 50% at 80% 42%, rgba(232,255,218,0.28) 0%, rgba(255,255,255,0) 68%)",
          ].join(", "),
        }}
      >
        <span className="inline-flex rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[12px] font-bold uppercase text-[#242424] shadow-sm">
          Upload &amp; Reuse
        </span>
        <h3 className="mx-auto mt-6 max-w-[760px] text-[34px] font-extrabold leading-[1.13] tracking-[-0.04em] text-black md:text-[52px]">
          Ready to show your genius?
        </h3>
        <p className="mx-auto mt-7 max-w-[585px] text-[22px] font-extrabold leading-[1.35] tracking-[-0.03em] text-black">
          Upload your FIGMA design &amp; join the creative community
        </p>
        <p className="mx-auto mt-[68px] max-w-[820px] text-[15px] font-medium leading-[1.55] text-[#666666]">
          Showcase your Figma designs, get inspired by others, and connect with fellow designers in the ultimate creative community.
        </p>
        <button className="mx-auto mt-10 flex h-[44px] items-center gap-4 rounded-full bg-black py-1.5 pl-6 pr-1.5 text-[12px] font-bold text-white">
          View Demo
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#9FE870] text-black">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </section>
  );
}

function PricingFooter() {
  return (
    <footer className="mt-[105px] bg-[linear-gradient(180deg,#a9f17b_0%,#eaffdf_34%,#ffffff_72%)] px-5 pt-[118px]">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr_1.25fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image src={fcLogo} alt="figma components" className="h-[42px] w-auto object-contain" />
            </Link>
            <p className="mt-8 max-w-[300px] text-[14px] font-medium leading-[1.8] text-[#6b6b6b]">
              Clarity gives you the blocks &amp; components you need to create a truly professional website, landing page or admin panel for your SaaS.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#e5e5e5] bg-white text-black"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16">
            <div>
              <p className="mb-8 inline-flex rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-2 text-[13px] font-medium text-black">
                Company
              </p>
              <div className="flex flex-col gap-7 text-[14px] font-medium text-[#282828]">
                <Link href="/pricing">Pricing Plans</Link>
                <Link href="#">FAQ</Link>
                <Link href="#">Contact Us</Link>
              </div>
            </div>
            <div className="pt-[61px]">
              <div className="flex flex-col gap-7 text-[14px] font-medium text-[#282828]">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="#">Careers</Link>
                <Link href="/terms-conditions">Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-8 inline-flex rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-2 text-[13px] font-medium text-black">
              Monthly Newsletter
            </p>
            <h3 className="max-w-[410px] text-[18px] font-medium leading-[1.35] tracking-[-0.02em] text-[#222222]">
              Level Up Your Workflow and Boost Results With <span className="font-extrabold">figma components</span>
            </h3>
            <form className="mt-8 flex h-[48px] w-full max-w-[420px] rounded-[8px] border border-[#e5e5e5] bg-white p-1">
              <input
                className="min-w-0 flex-1 px-4 text-[14px] outline-none placeholder:text-[#b9b9b9]"
                placeholder="Email Address"
                type="email"
                required
              />
              <button className="rounded-[6px] bg-black px-5 text-[13px] font-medium text-white">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[72px] border-t border-[#e6e6e6] py-6 text-center text-[15px] font-medium text-[#737373]">
          Copyright &amp; design by <span className="font-bold text-[#1c1c1c]">@figmacomponents.site</span> - 2026
        </div>
      </div>
    </footer>
  );
}

export default function PricingClient({ initialPlans }: { initialPlans: Plan[] }) {
  const { user, setLoginModalOpen } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingPlanName, setPendingPlanName] = useState<string | null>(null);

  const { data: subscriptionData, refetch: refetchSubscription } = useQuery({
    queryKey: ["subscription", "checkAccess"],
    queryFn: () => paymentsApi.checkAccess(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
      if (err.message === "SUBSCRIPTION_EXISTS") {
        errMsg = "You already have an active subscription.";
      } else {
        errMsg = err.message || "Failed to create payment. Please try again.";
      }
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  }, [hasActiveSubscription, refetchSubscription, user]);

  const handlePlanSelect = async (planName: string) => {
    const plan = initialPlans?.find((p) => p.name === planName);

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
    if (!user || !pendingPlanName || loading) return;
    const pendingPlan = initialPlans?.find((p) => p.name === pendingPlanName);
    if (!pendingPlan) return;
    setPendingPlanName(null);
    startPayment(pendingPlan);
  }, [loading, pendingPlanName, initialPlans, startPayment, user]);

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-10 pt-[80px]">
        <div className="text-center">
          <h1 className="text-[42px] font-medium leading-[1.18] tracking-[-0.045em] text-[#161616] md:text-[54px]">
            Powerful features for
            <br />
            <span className="bg-[linear-gradient(90deg,#275ff1_8%,#64b9d7_52%,#7ac983_96%)] bg-clip-text text-transparent">
              Powerful Creators
            </span>
          </h1>
          <p className="mt-5 text-[16px] font-medium tracking-[-0.02em] text-[#222222]">
            Choose a plan that&apos;s right for you
          </p>
        </div>

        <div className="mx-auto mt-[72px] grid max-w-[960px] grid-cols-1 gap-10 md:grid-cols-3 md:items-start md:gap-[48px]">
          {initialPlans && initialPlans.length > 0 ? (
            initialPlans.map((plan, index) => (
              <PricingCard
                key={plan._id}
                plan={plan}
                highlighted={index === 1}
                onGetStarted={() => handlePlanSelect(plan.name)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-[#86909c]">
              Plans are currently unavailable. Please check back later.
            </div>
          )}
        </div>
      </section>

      <SpatialitySection />
      <PricingFooter />
    </main>
  );
}
