import hero2Img from "../assets/Hero2.png";

export function PremiumDesignsSection() {
  return (
    <section className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between py-12 sm:py-16 lg:py-24 px-4 md:px-8 gap-8 sm:gap-12 lg:gap-20 relative z-20">

      {/* Left: Text */}
      <div className="w-full md:w-[45%] flex flex-col items-start shrink-0">

        <div className="bg-[#ebd5ff] text-[#9b41ee] font-bold text-[0.72rem] px-4 py-1.5 rounded-full mb-6 sm:mb-8 tracking-wide">
          Feature
        </div>

        <h2 className="text-[#111827] font-extrabold text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[1.08] tracking-tight mb-5 sm:mb-8">
          Our Premium<br />Designs
        </h2>

        <p className="text-[#6B7280] font-medium text-[0.88rem] sm:text-[0.95rem] md:text-[1.05rem] leading-relaxed mb-8 sm:mb-12 max-w-[420px]">
          We're launching 100 more this summer, quick previews never hurt anyone.
        </p>

        <button
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-[#9b41ee] flex items-center justify-center text-[#9b41ee] transition-all hover:bg-[#ebd5ff]"
          aria-label="View Premium Designs"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 7H17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

      </div>

      {/* Right: Image */}
      <div className="w-full md:w-[55%] flex justify-center md:justify-end">
        <img
          src={hero2Img}
          alt="Premium Designs Preview"
          className="w-full h-auto max-w-[560px] md:max-w-[650px] rounded-[18px] sm:rounded-[24px] object-cover shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        />
      </div>

    </section>
  );
}
