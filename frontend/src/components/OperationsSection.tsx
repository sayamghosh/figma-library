

export function OperationsSection() {
  return (
    <section className="w-full flex flex-col items-center py-20 bg-[#F8F9FA]">
      <div className="flex flex-col items-center w-[1280px] max-w-full px-4">
        {/* Heading */}
        <h2 className="text-center text-[#111827] font-outfit font-bold text-[48px] leading-[60px] max-w-[800px] mb-6">
          Effortless <span className="text-[#A855F7]">Operations</span> for<br />
          <span className="inline-flex items-center align-middle gap-3">
            <span className="relative flex items-center">
              {/* Toggle SVG */}
              <svg width="72" height="40" viewBox="0 0 72 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="72" height="40" rx="20" fill="#B1B5C3" />
                <circle cx="20" cy="20" r="14" fill="white" />
              </svg>
              {/* Cursor SVG */}
              <svg className="absolute -bottom-4 -right-3 w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2L18 13.5H12.5L15 21L12.5 22.5L9.5 15.5L4 21V2Z" fill="white" stroke="black" strokeWidth="1.5" />
              </svg>
            </span>
            Exceptional Websites
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-center font-manrope font-normal text-[18px] leading-[30px] text-[#4B5563] max-w-[850px] mb-16">
          Scale your productivity with a curated library of assets. Whether it’s high-fidelity wireframes or
          production-ready code, we provide the tools—you provide the vision
        </p>

        {/* Cards Section */}
        <div className="w-[1179px] max-w-full flex justify-between gap-[33px] flex-wrap md:flex-nowrap">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="w-[270px] h-[280px] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              {/* Card Top / Light Purple Area */}
              <div className="flex-1 bg-[#F3F1FB]"></div>

              {/* Card Bottom / Text part */}
              <div className="h-[90px] flex flex-col items-center justify-center bg-white border-t border-gray-50">
                <h3 className="font-manrope font-semibold text-[18px] text-[#111827]">Component</h3>
                <p className="font-manrope font-normal text-[12px] text-[#6B7280]">Browse 100+ Components</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
