import { Link } from "@tanstack/react-router";
import heroImg from "../assets/heroimg.png";
import { FlipWords } from "./ui/flip-words";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center pb-8 sm:pb-12 overflow-hidden">

      {/* Text & CTA */}
      <div className="relative z-20 flex flex-col items-center pt-10 sm:pt-16 md:pt-28 px-4 w-full">
        <h1 className="text-center text-[#111827] font-extrabold font-outfit text-[2.2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem] leading-[1.1] mb-6 sm:mb-8 w-full max-w-full px-2">
          The ultimate <FlipWords 
            words={["Figma UI kit", "developer toolkit", "design system", "component library"]} 
            className="text-[#8A2BE2]"
          />
        </h1>

        <p className="text-center font-manrope  text-gray-500 font-medium text-[0.92rem] sm:text-[1rem] md:text-[1.1rem] mb-8 sm:mb-10 max-w-[700px] leading-relaxed tracking-wider px-2">
          100+ components made for Developers, Designers &amp; Business Owners who want to test
          multiple ideas in no time. No code Required
        </p>

        <HoverBorderGradient
          containerClassName="rounded-full shadow-[0_12px_24px_-8px_rgba(138,43,226,0.6)]"
          as="button"
          className="bg-black text-white flex items-center space-x-2"
        >
          <Link
            to="/components"
            className="font-semibold text-[0.95rem] sm:text-[1.05rem] px-4 sm:px-6 py-1.5 sm:py-2 transition-all block"
            style={{ color: "#ffffff" }}
          >
            Explore Library
          </Link>
        </HoverBorderGradient>
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
