import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <section className="figma-hero relative isolate min-h-[860px] w-full overflow-hidden bg-[#eef1f7] px-5 pt-[148px] sm:px-8 lg:min-h-[930px] xl:min-h-[984px]">
      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <div className="hero-eyebrow mb-9 inline-flex h-[28px] items-center rounded-full bg-white px-[15px] font-manrope text-[15px] font-extrabold leading-none text-[#17191e] shadow-[inset_0_0_0_1px_rgba(16,24,40,0.10)] sm:text-[16px] lg:mb-[38px]">
          CX PLATFORM GIVES YOUR TEAM SUPERPOWERS
        </div>

        <h1 className="max-w-[850px] font-outfit text-[clamp(3.25rem,5.05vw,5.95rem)] font-semibold leading-[1.035] tracking-normal text-[#141519] sm:max-w-[980px]">
          Largest collection of
          <br />
          desktop and mobile
          <br />
          layout for <span className="text-[#9FE870]">figma</span>
        </h1>

        <div className="mt-[54px] flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-[34px]">
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
    </section>
  );
}
