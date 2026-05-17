"use client";
import Link from "next/link";
import Image from "next/image";

const heroImg = "/hero-image.png";

export function HeroSection() {
  return (
    <section className="figma-hero relative flex min-h-[calc(100dvh-60px)] w-full flex-col overflow-hidden bg-white px-5 pt-8 sm:px-8 sm:pt-12 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-20%] top-[-42%] h-[78%] w-[88%] rotate-[-31deg] bg-[#f1f1f1]" />
        <div className="absolute right-[-32%] top-[-28%] h-[82%] w-[96%] rotate-[-31deg] bg-[#f4f4f4]" />
        <div className="absolute bottom-0 left-0 h-[44%] w-full bg-white" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1344px] flex-col items-center text-center">
        <h1 className="max-w-[980px] font-dm-sans text-[32px] font-bold leading-[1.2] tracking-tight text-[#001b0b] sm:text-[48px] md:text-[64px] lg:text-7xl xl:text-6xl 2xl:max-w-[1080px] 2xl:text-6xl">
          Collection of desktop and
          <br className="hidden sm:block" />
          mobile <span className="text-[#9FE870]">figma</span> layouts
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-center sm:gap-10">
          <Link
            href="/components"
            className="group inline-flex h-[56px] items-center gap-4 rounded-full bg-white py-2 pl-7 pr-3 font-dm-sans text-[16px] font-medium text-black shadow-[0_14px_45px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_18px_55px_rgba(0,0,0,0.1)] active:scale-[0.98] sm:h-[58px] sm:text-[18px]"
          >
            Components
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#9FE870] text-black transition-transform group-hover:-rotate-45 sm:h-[36px] sm:w-[36px]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]"
              >
                <path
                  d="M4 10h12M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="pointer-events-none relative mt-10 z-10 w-[92vw] self-center select-none sm:mt-14 sm:w-[85vw] md:mt-16 lg:mt-10 lg:w-[1120px] xl:w-[1200px] 2xl:w-[1280px]">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={heroImg}
            alt="Figma component previews arranged across a design canvas"
            fill
            priority
            sizes="(min-width: 1536px) 1280px, (min-width: 1280px) 1200px, (min-width: 1024px) 1120px, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
