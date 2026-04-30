import { Link } from "@tanstack/react-router";
import heroImg from "../assets/heroimg.png";

export function HeroSection() {
  return (
    <section className="figma-hero relative isolate w-full overflow-hidden bg-[#e9edf5] px-5 pb-0 pt-[104px] sm:px-8 sm:pt-[124px] lg:pt-[148px]">
      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <div className="hero-eyebrow inline-flex min-h-[28px] max-w-full items-center rounded-full bg-white px-[15px] py-1.5 font-manrope text-[12px] font-extrabold leading-tight text-[#17191e] shadow-[inset_0_0_0_1px_rgba(16,24,40,0.10)] sm:text-[15px] lg:text-[16px]">
          CX PLATFORM GIVES YOUR TEAM SUPERPOWERS
        </div>

        <h1 className="mt-8 max-w-[980px] font-outfit text-[clamp(3rem,7vw,5.95rem)] font-semibold leading-[1.035] tracking-normal text-[#141519] sm:mt-9 sm:text-[clamp(4.25rem,6vw,5.95rem)]">
          Largest collection of
          <br />
          desktop and mobile
          <br />
          layout for <span className="text-[#9b45d9]">figma</span>
        </h1>

        <div className="mt-10 flex flex-col gap-5 sm:mt-12 sm:flex-row sm:items-center sm:gap-[34px]">
          <Link
            to="/components"
            className="inline-flex h-[54px] w-fit items-center gap-5 rounded-full bg-white py-2 pl-[26px] pr-2 font-manrope text-[15px] font-extrabold text-[#15171b] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#98e967]/35 sm:text-[16px]"
          >
            Components
            <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#96e96a] text-[#15171b]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                <path d="M3.2 8.5h10.1M9.1 4.3l4.2 4.2-4.2 4.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <p className="font-manrope text-[17px] font-medium leading-[1.4] text-[#9ca0aa] sm:text-[18px]">
            365-day trial,
            <br />
            Copy and Paste for free
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 w-full max-w-[1580px] sm:mt-20 lg:mt-24">
        <img
          src={heroImg}
          alt="Figma component previews arranged across a design canvas"
          className="mx-auto w-full max-w-none object-contain"
          loading="eager"
        />
      </div>
    </section>
  );
}
