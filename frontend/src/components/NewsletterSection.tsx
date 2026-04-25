import mailImg from "../assets/mail.png";

export function NewsletterSection() {
  return (
    <section className="relative w-full">
      {/* Background split */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 z-0" />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="w-full rounded-[20px] sm:rounded-[30px] bg-gradient-to-r from-[#6b21a8] to-[#c084fc] shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between py-8 sm:py-12 md:py-16 px-6 sm:px-10 md:px-16 lg:px-20 gap-6 sm:gap-10">

          {/* Mail graphic — hidden on mobile to save space */}
          <div className="shrink-0 hidden sm:flex items-center justify-center w-[140px] md:w-[240px] lg:w-[300px]">
            <img src={mailImg} alt="Newsletter Mail Graphic" className="w-full max-w-[240px] h-auto object-contain" />
          </div>

          {/* Content */}
          <div className="flex flex-col w-full max-w-[500px]">
            <h2 className="text-white font-bold text-[1.7rem] sm:text-[2rem] md:text-[2.6rem] lg:text-[3rem] leading-[1.15] mb-3 sm:mb-5">
              Stay Connected<br />with Us!
            </h2>
            <p className="text-purple-100 text-[0.85rem] sm:text-[0.95rem] mb-5 sm:mb-6 font-medium">
              Save your email below as an intermediary
            </p>

            <form className="w-full flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full p-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.1)] gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-[#E81CFF] transition-all">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border-none outline-none text-gray-700 px-4 sm:px-5 py-2 sm:py-0 text-[0.9rem] sm:text-[0.95rem] placeholder-gray-400 rounded-xl sm:rounded-none"
                required
              />
              <button
                type="submit"
                className="bg-[#E81CFF] hover:bg-[#D510EB] text-white font-semibold text-[0.88rem] sm:text-[0.95rem] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full transition-colors shadow-sm"
                style={{ color: "#ffffff" }}
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
