import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { componentsApi } from "../api/components";
import { Check, ArrowRight, Crown, Zap, ArrowUpRight, AlignLeft, Wallet, Briefcase, MoreHorizontal, RefreshCw } from "lucide-react";

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
      <Link to="/components" className="absolute left-14 top-[-18px] flex items-center rounded-full bg-white py-1.5 pr-5 pl-1.5 text-[13px] shadow-md group cursor-pointer">
        <span className="flex items-center gap-1 rounded-full bg-[#b4f090] px-3 py-1 font-bold text-[#2c5114] hover:bg-black hover:text-white"><ArrowUpRight size={14} strokeWidth={3}/> view</span>
        <span className="ml-3 text-[#6f6f6f] font-medium text-[11px] hover:text-black transition-colors">Recent Uploaded</span>
      </Link>
    </div>
  );
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
}: {
  dark?: boolean;
  title: string;
  price: string;
  period: string;
  icon: any;
  isSelected: boolean;
  onClick: () => void;
  features: string[];
}) {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-500 overflow-hidden ${dark ? "bg-black text-white" : "bg-[#f5f6f8] text-[#111111]"} rounded-[20px] p-10 ${isSelected ? "ring-2 ring-[#9FE870] ring-offset-2" : "hover:scale-[1.02]"}`}
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
      <p className={`mt-10 max-w-[240px] text-[16px] leading-[1.6] font-medium ${dark ? "text-[#a0a0a0]" : "#666666"}`}>
        For personal use & explanation of AI technology.
      </p>
      <div className="mt-10">
        <Link
          to="/components"
          className={`group inline-flex h-[56px] items-center gap-5 rounded-full py-2 pl-8 pr-2 text-[15px] font-bold transition-all ${dark ? "bg-[#9FE870] text-black hover:opacity-90" : "border border-[#dedede] bg-white text-black hover:border-black"}`}
        >
          Try For Free
          <span className={`grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${dark ? "bg-white text-black" : "bg-[#9FE870] text-black"}`}>
            <ArrowRight size={20} strokeWidth={2.5} />
          </span>
        </Link>
      </div>

      {isSelected && (
        <div className={`mt-10 pt-10 border-t lg:absolute lg:right-12 lg:top-10 lg:mt-0 lg:w-[48%] lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 animate-in fade-in slide-in-from-right-4 duration-500 ${dark ? "border-white/10" : "border-black/10"}`}>
          <ul className={`space-y-6 text-[15px] font-medium ${dark ? "text-white/90" : "text-black/80"}`}>
            {features.map((item) => (
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "advanced">("advanced");

  const plans = {
    basic: billingCycle === "monthly" ? "₹ 199.99" : "₹ 1999.99",
    advanced: billingCycle === "monthly" ? "₹ 499.99" : "₹ 4999.99",
    period: billingCycle === "monthly" ? "mo" : "yr",
  };

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
      <section className="w-full bg-[#f3f4f6] px-5 py-24 sm:px-8 lg:py-32">
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

            <Link to="/components" className="mt-12 inline-flex h-[58px] items-center gap-5 rounded-full bg-black py-2 pl-8 pr-2 text-[15px] font-semibold text-white group">
              Browse Components
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9FE870] text-black transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={20} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="w-full bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mx-auto max-w-[780px] text-center">
            <p className="mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-black">
              Pricing & plans
            </p>
            <h2 className="mt-8 font-outfit text-[clamp(2.3rem,3.6vw,4.2rem)] font-medium leading-[1.1] text-[#111111]">
              Developing strong ideas into relatable and concrete
            </h2>
            <div className="mx-auto mt-14 inline-flex items-center gap-2 rounded-full bg-[#b4f090] p-1.5 text-[12px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 transition-all ${billingCycle === "monthly" ? "bg-black text-white" : "text-[#4a6b2c]"}`}
              >
                {billingCycle === "monthly" && <div className="h-1.5 w-1.5 rounded-full bg-[#9FE870]"></div>}
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 transition-all ${billingCycle === "yearly" ? "bg-black text-white" : "text-[#4a6b2c]"}`}
              >
                {billingCycle === "yearly" && <div className="h-1.5 w-1.5 rounded-full bg-[#9FE870]"></div>}
                Yearly
              </button>
            </div>
          </div>

          <div className={`mt-16 grid gap-8 transition-all duration-500 lg:items-start ${selectedPlan === "basic" ? "lg:grid-cols-[2.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_2.1fr]"}`}>
            <PlanCard 
              title="Basic plan" 
              price={plans.basic} 
              period={plans.period} 
              icon={Zap} 
              isSelected={selectedPlan === "basic"}
              onClick={() => setSelectedPlan("basic")}
              features={basicFeatures}
            />
            <PlanCard 
              dark 
              title="Advanced plan" 
              price={plans.advanced} 
              period={plans.period} 
              icon={Crown} 
              isSelected={selectedPlan === "advanced"}
              onClick={() => setSelectedPlan("advanced")}
              features={advancedFeatures}
            />
          </div>
        </div>
      </section>
    </>
  );
}
