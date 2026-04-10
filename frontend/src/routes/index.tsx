import { Link, createFileRoute } from "@tanstack/react-router";
import heroImg from "../assets/heroimg.png";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <section className="relative w-full flex flex-col items-center pb-16 overflow-hidden">
      
      {/* Foreground Overlay Layer (Text & Button) */}
      <div className="relative z-20 flex flex-col items-center pt-16 md:pt-28 px-4 w-full">
        <h1 className="text-center text-[#111827] font-extrabold text-[2.8rem] sm:text-[3.5rem] md:text-[4.7rem] leading-[1.05] mb-6 tracking-[-0.03em] max-w-[850px]">
          The ultimate Figma UI kit
        </h1>
        
        <p className="text-center text-gray-500 font-medium text-[1rem] sm:text-[1.15rem] mb-10 max-w-[700px] leading-relaxed">
          100+ components made for Developers, Designers & Business Owners who want to test multiple ideas in no time. No code Required
        </p>
        
        <Link 
          to="/components" 
          className="inline-block bg-gradient-to-r from-[#8A2BE2] to-[#A020F0] hover:from-[#7B24C5] hover:to-[#911CD9] text-white font-semibold text-[1.05rem] px-8 py-3.5 rounded-[12px] shadow-[0_12px_24px_-8px_rgba(138,43,226,0.6)] transition-all transform hover:-translate-y-0.5"
        >
          Explore Library
        </Link>
      </div>

      {/* Background Image Layer (Pulled under the text) */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-2 sm:px-6 md:px-12 flex justify-center -mt-20 sm:-mt-32 md:-mt-56 lg:-mt-[16rem]">
        <img 
          src={heroImg} 
          alt="UI Kit Preview" 
          className="w-full h-auto mx-auto block object-contain pointer-events-none"
        />
      </div>

    </section>
  );
}
