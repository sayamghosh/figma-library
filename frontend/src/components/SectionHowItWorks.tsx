import { useQuery } from "@tanstack/react-query";
import { Globe, Copy, ClipboardPaste } from "lucide-react";
import { componentsApi } from "../api/components";
import componentsSvg from "../assets/components.svg";
import heroComponentsSvg from "../assets/hero-components.svg";
import patternSvg from "../assets/pattern.svg";

const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Explore All Components,\nor All Inspiration",
    className: "bg-[#9FE870] text-[#111111]",
    badge: "bg-white text-[#111111]",
    icon: Globe,
  },
  {
    number: "02",
    title: "Copy",
    description: "Copy from 100+ designs\n(50 more coming this summer)",
    className: "bg-black text-white",
    badge: "bg-[#9FE870] text-[#111111]",
    icon: Copy,
  },
  {
    number: "03",
    title: "Paste",
    description: "Paste into your project.\nWorks best on app verions",
    className: "bg-[#f4f5f7] text-[#111111]",
    badge: "bg-white text-[#111111]",
    icon: ClipboardPaste,
  },
];

function TradingMockup() {
  return (
    <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[10px] border border-[#d8d8d8] bg-white">
      <img
        src={componentsSvg}
        alt="Figma component library preview"
        className="h-full max-h-[390px] w-full object-contain"
      />
    </div>
  );
}

function CreditCardMockup() {
  return (
    <div className="flex min-h-[330px] items-center justify-center overflow-hidden rounded-[10px] border border-[#d8d8d8] bg-white">
      <img
        src={heroComponentsSvg}
        alt="Figma component library preview"
        className="h-full max-h-[371px] w-full object-contain"
      />
    </div>
  );
}

export function SectionHowItWorks() {
  const { data: topCreators } = useQuery({
    queryKey: ["topCreators"],
    queryFn: () => componentsApi.getTopCreators(),
  });

  return (
    <section className="w-full bg-white px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="relative min-h-[440px] overflow-hidden pt-[68px] text-center sm:min-h-[500px]">
          <img
            src={patternSvg}
            alt=""
            className="pointer-events-none absolute left-1/2 top-0 z-0 w-[1300px] max-w-none -translate-x-1/2 opacity-100"
          />
          <div className="relative z-10 mx-auto flex w-fit items-center">
            {topCreators && topCreators.length > 0 ? (
              topCreators.map((creator, index) => (
                <span
                  key={creator._id}
                  className={`grid h-[61px] w-[61px] place-items-center overflow-hidden rounded-full bg-[#d9d9d9] font-bold text-gray-500 shadow-md ${index > 0 ? "-ml-[13px]" : ""
                    }`}
                  title={creator.name}
                >
                  {creator.profilePicture ? (
                    <img
                      src={creator.profilePicture}
                      alt={creator.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    creator.name.charAt(0).toUpperCase()
                  )}
                </span>
              ))
            ) : (
              <>
                <span className="h-[61px] w-[61px] rounded-full bg-[#d9d9d9] shadow-md" />
                <span className="-ml-[13px] h-[61px] w-[61px] rounded-full bg-[#d9d9d9] shadow-md" />
              </>
            )}

            <span className="-ml-[13px] grid h-[61px] w-[61px] place-items-center rounded-full bg-[#9FE870] text-[17px] font-semibold text-[#111111] shadow-md">
              {topCreators && topCreators.length > 0 ? topCreators[0].componentCount + "+" : "20+"}
            </span>
            <span className="ml-[22px] text-left text-[17px] font-semibold uppercase leading-[1.55] text-[#111111]">
              Top Creator
              <br />
              Components
            </span>
          </div>

          <p className="relative z-10 mx-auto mt-[188px] inline-flex rounded-full border border-[#d7d7d7] bg-white px-6 py-2 text-sm font-semibold uppercase leading-none text-[#111111] sm:mt-[190px]">
            SIMPLE STEPS STEP'S TO BUILD
          </p>
          <h2 className="relative z-10 mt-7 font-outfit text-[clamp(3.2rem,4vw,4.35rem)] font-semibold leading-none tracking-normal text-[#050505]">
            How it works
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className={`flex min-h-[305px] flex-col items-center justify-center rounded-[16px] p-8 text-center ${step.className}`}>
              <span className={`rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wide ${step.badge}`}>Step - {step.number}</span>
              <step.icon strokeWidth={1.25} size={42} className="mt-8 mb-2" />
              <h3 className="font-outfit text-[clamp(3rem,4vw,4.4rem)] font-medium leading-none tracking-tight">
                {step.title}
              </h3>
              <p className="mt-5 max-w-[210px] whitespace-pre-line text-sm font-medium leading-[1.6] opacity-80">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-28 pt-20">
          <div className="mb-20 flex flex-wrap items-center justify-center gap-10 text-[16px] font-medium">
            <span className="relative z-10 mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-6 py-2 text-sm font-semibold uppercase leading-none text-[#111111]">Design System and UI Kit</span>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <TradingMockup />
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
                Customize styles
              </p>
              <h3 className="max-w-[620px] font-outfit text-[clamp(2rem,3vw,3.4rem)] font-medium leading-tight text-[#111111]">
                Instantly customize styles to match your vision
              </h3>
              <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
                Hundreds of preconfigured styles for colors, fonts, effects, spacing, and radius. Instantly update your entire Figma component library with ease.
              </p>
              <p className="mt-10 max-w-[620px] border-l border-black pl-6 text-[18px] leading-[1.55] font-semibold text-[#111111]">
                Global styles tweak designs fast. Accessible colors, typography <br /> easy light / dark mode switching with built-in variables.
              </p>
            </div>
          </div>

          <div className="mt-28 grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
                Smart component
              </p>
              <h3 className="max-w-[640px] font-outfit text-[clamp(2rem,3vw,3.4rem)] font-medium leading-tight text-[#111111]">
                A large, intelligent component library
              </h3>
              <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
                We built adaptable, user-friendly components using the latest Figma features, ensuring flexibility, modern design standards, and full accessibility.
              </p>
              <p className="mt-10 max-w-[620px] border-l border-black pl-6 text-[18px] leading-[1.55] font-semibold text-[#111111]">
                Variants, properties, nested instances, and interactive <br /> components enable fast, flexible customization.
              </p>
            </div>
            <CreditCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
