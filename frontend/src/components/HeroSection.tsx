import { Link } from "@tanstack/react-router";
import heroImg from "../assets/heroimg.png";

export function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center pb-8 sm:pb-12 overflow-hidden">

      {/* Text & CTA */}
      <div className="relative z-20 flex flex-col items-center pt-10 sm:pt-16 md:pt-28 px-4 w-full">
        <h1 className="text-center text-[#111827] font-extrabold text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] lg:text-[4.7rem] leading-[1.08] mb-4 sm:mb-6 tracking-[-0.03em] max-w-[850px]">
          The ultimate Figma UI kit
        </h1>

        <p className="text-center text-gray-500 font-medium text-[0.92rem] sm:text-[1rem] md:text-[1.1rem] mb-8 sm:mb-10 max-w-[600px] leading-relaxed px-2">
          100+ components made for Developers, Designers &amp; Business Owners who want to test
          multiple ideas in no time. No code Required
        </p>

        <Link
          to="/components"
          className="inline-block bg-gradient-to-r from-[#8A2BE2] to-[#A020F0] hover:from-[#7B24C5] hover:to-[#911CD9] text-white font-semibold text-[0.95rem] sm:text-[1.05rem] px-6 sm:px-8 py-3 sm:py-3.5 rounded-[12px] shadow-[0_12px_24px_-8px_rgba(138,43,226,0.6)] transition-all"
          style={{ color: "#ffffff" }}
        >
          Explore Library
        </Link>
      </div>

      {/* Hero image */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-2 sm:px-6 md:px-12 flex justify-center -mt-12 sm:-mt-24 md:-mt-44 lg:-mt-[14rem]">
        <img
          src={heroImg}
          alt="UI Kit Preview"
          className="w-full h-auto mx-auto block object-contain pointer-events-none"
        />
      </div>

    </section>
  );
}
