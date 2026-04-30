import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function IntegrationVisual() {
  return (
    <div className="relative min-h-[430px]">
      <div className="absolute left-0 top-0 h-[390px] w-[76%] rounded-[10px] bg-[linear-gradient(90deg,#111_0_12%,#d8d8d8_12%_82%,#9FE870_82%_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.08)]" />
      <div className="absolute bottom-3 right-8 w-[230px] rounded-xl bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[16px] font-medium">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#9FE870]">□</span>
            Overdue
          </span>
          <span>...</span>
        </div>
        <p className="mt-5 text-[27px] font-medium text-[#111111]">$890.00</p>
        <p className="mt-2 text-[10px] text-[#777777]">Updated 1month ago</p>
      </div>
      <div className="absolute left-14 top-[-18px] rounded-full bg-white px-5 py-2 text-[13px] shadow-md">
        <span className="rounded-full bg-[#9FE870] px-5 py-2 font-semibold">71 + 12%</span>
        <span className="ml-3 text-[#6f6f6f]">Customer Satisfaction (CSAT): 4.7/5</span>
      </div>
    </div>
  );
}

function PlanCard({
  dark = false,
  title,
  price,
  children,
}: {
  dark?: boolean;
  title: string;
  price: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative ${dark ? "bg-black text-white" : "bg-[#f5f6f8] text-[#111111]"} rounded-[10px] p-9`}>
      <h3 className="text-[24px] font-medium">{title}</h3>
      <p className={`mt-5 text-[clamp(3rem,5vw,4.7rem)] font-medium leading-none ${dark ? "text-[#9FE870]" : "text-[#111111]"}`}>
        {price}
      </p>
      <p className={`mt-12 max-w-[240px] text-[17px] leading-[1.55] ${dark ? "text-[#b7b7b7]" : "text-[#666666]"}`}>
        For personal use & explanation of AI technology.
      </p>
      <Link
        to="/components"
        className={`mt-9 inline-flex h-[54px] items-center gap-4 rounded-full py-2 pl-7 pr-2 text-[14px] font-semibold ${dark ? "bg-[#9FE870] text-black" : "border border-[#dedede] bg-white text-black"}`}
      >
        Try For Free
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9FE870] text-black">→</span>
      </Link>
      {children}
    </div>
  );
}

export function PremiumDesignsSection() {
  return (
    <>
      <section className="w-full bg-[#f3f4f6] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-16 lg:grid-cols-2">
          <IntegrationVisual />
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
              Real-time analytics
            </p>
            <h2 className="max-w-[690px] font-outfit text-[clamp(2.3rem,3.6vw,4.2rem)] font-medium leading-tight text-[#111111]">
              Integration capabilities include RESTful APIs
            </h2>
            <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
              Automation & workflow features include a drag & drop builder, automated task assignments, conditional with good triggers, and api integrations.
            </p>

            <div className="mt-12 space-y-9">
              {["Marketing and engagement features", "Management ensures secure"].map((item) => (
                <div key={item} className="flex gap-7">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#d9d9d9] bg-white">□</span>
                  <div>
                    <h3 className="text-[24px] font-semibold text-[#111111]">{item}</h3>
                    <p className="mt-2 text-[17px] text-[#6f6f6f]">SaaS and app solutions offer a comprehensive range</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/components" className="mt-12 inline-flex h-[58px] items-center gap-5 rounded-full bg-black py-2 pl-8 pr-2 text-[15px] font-semibold text-white">
              Book A Demo
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9FE870] text-black">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mx-auto max-w-[780px] text-center">
            <p className="mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
              Pricing & plans
            </p>
            <h2 className="mt-8 font-outfit text-[clamp(2.3rem,3.6vw,4.2rem)] font-medium leading-tight text-[#111111]">
              Evolving powerful concepts into tangible and relatable
            </h2>
            <div className="mx-auto mt-14 inline-flex rounded-full bg-[#9FE870] p-1 text-[13px] font-semibold uppercase">
              <span className="rounded-full bg-black px-4 py-2 text-white">Monthly</span>
              <span className="px-4 py-2 text-[#59843e]">Yearly</span>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_2.1fr]">
            <PlanCard title="Basic plan" price="Rs 199.99" />
            <PlanCard dark title="Advanced plan" price="Rs 499.99">
              <div className="mt-10 border-t border-white/20 pt-8 lg:absolute lg:right-16 lg:top-10 lg:mt-0 lg:w-[45%] lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                <ul className="space-y-6 text-[17px]">
                  {[
                    "Task creation and management",
                    "Included money back guarantee",
                    "Competitive price comparison",
                    "Premium service exclusive features",
                    "Value highlighted clearly",
                    "Upgrade path expanded",
                  ].map((item) => (
                    <li key={item} className="flex gap-4">
                      <span className="text-[#9FE870]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </PlanCard>
          </div>
        </div>
      </section>
    </>
  );
}
