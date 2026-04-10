export function NewsletterSection() {
  return (
    <section className="relative w-full">
      {/* Background split: Top is transparent, Bottom is peach to match footer */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#FEF7F3] to-[#FDF4EE] z-0"></div>

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 pt-16 pb-8">
        <div className="w-full rounded-[30px] bg-gradient-to-r from-[#6b21a8] to-[#c084fc] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between py-12 md:py-16 px-8 md:px-20 gap-10">
          
          {/* Left Side: Graphic */}
          <div className="shrink-0 relative hidden sm:flex items-center justify-center w-[200px] md:w-[300px]">
             {/* Custom SVG Illustration imitating the overlapping cards & envelope */}
             <svg width="220" height="220" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Card 1 (Left) */}
                <rect x="40" y="50" width="90" height="120" rx="12" transform="rotate(-25 40 50)" stroke="#A1A1AA" strokeWidth="7" fill="none" strokeOpacity="0.8" />
                <path d="M 50 70 Q 70 50, 90 70 T 120 60" stroke="#A1A1AA" strokeWidth="7" fill="none" transform="rotate(-25 40 50)" strokeOpacity="0.8" />
                
                {/* Card 2 (Right) */}
                <rect x="100" y="40" width="90" height="120" rx="12" transform="rotate(15 100 40)" stroke="#D4D4D8" strokeWidth="7" fill="none" strokeOpacity="0.8" />
                <text x="130" y="105" transform="rotate(15 100 40)" fill="#D4D4D8" fontSize="42" fontWeight="bold" fontFamily="sans-serif" opacity="0.8">@</text>

                {/* Envelope (Front) */}
                <rect x="75" y="110" width="110" height="75" stroke="#FF8A00" strokeWidth="8" fill="#8b5cf6" />
                <path d="M75 110 L130 150 L185 110" stroke="#FF8A00" strokeWidth="8" fill="none" strokeLinejoin="round" />
             </svg>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col flex-1 w-full max-w-[500px]">
            <h2 className="text-white font-bold text-[2.5rem] md:text-[3.2rem] leading-[1.1] mb-6">
              Stay Connected<br />with Us!
            </h2>
            <p className="text-purple-100 text-[0.95rem] mb-6 font-medium">
              Save your email below as an intermediary
            </p>

            <form className="w-full flex items-center bg-white rounded-full p-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-[#E81CFF] transition-all">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-transparent border-none outline-none text-gray-700 px-5 text-[0.95rem] placeholder-gray-400"
                required
              />
              <button 
                type="submit" 
                className="bg-[#E81CFF] hover:bg-[#D510EB] text-white font-semibold text-[0.95rem] px-8 py-3.5 rounded-full transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
