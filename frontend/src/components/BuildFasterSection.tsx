export function BuildFasterSection() {
  return (
    <section className="w-full max-w-[1200px] mx-auto flex flex-col items-center pt-8 pb-32 px-4 relative z-20">
      
      {/* Title & Toggle */}
      <h2 className="text-center text-[#111827] font-extrabold text-[2.2rem] md:text-[3rem] tracking-tight leading-[1.2] mb-16 flex flex-col items-center">
        <span>Build Faster with</span>
        <span className="flex items-center gap-3 mt-2">
          <span className="relative flex items-center justify-center mr-2">
            {/* Toggle Track */}
            <div className="w-[3.6rem] h-[2rem] bg-[#b1b5c3] rounded-full flex items-center px-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] opacity-90">
              <div className="w-[1.6rem] h-[1.6rem] bg-white rounded-full shadow-sm"></div>
            </div>
            {/* Cursor Icon SVG */}
            <div className="absolute -bottom-4 right-0 z-10 w-6 h-6 drop-shadow-md pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 2.5L20.5 10.5L13.5 12.5L16.5 19.5L12.5 21.5L9.5 14.5L4.5 18.5V2.5Z" fill="white" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </span>
          100+ Components Prebuilt
        </span>
      </h2>

      {/* 2-Column Content Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 w-full">
        
        {/* Left Diagram: Interactive Components with Arrow */}
        <div className="relative inline-flex flex-col shrink-0">
          {/* Dashed Border Container */}
          <div className="border-[2px] border-dashed border-[#B193FE] p-[1.15rem] flex flex-col gap-3 rounded-xl bg-transparent">
            
            {/* Box 1: Interactive */}
            <div className="bg-[#4D45E5] text-white font-bold text-[1.8rem] sm:text-[2.2rem] tracking-tight px-6 sm:px-10 py-4 sm:py-5 border-[2.5px] border-[#111827] rounded-[10px] shadow-sm relative z-10 w-[240px] sm:w-[280px] text-center">
              Interactive
              {/* Circle Dot Connector */}
              <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-3.5 h-3.5 bg-white border-[2.5px] border-[#111827] rounded-full z-20"></div>
            </div>
            
            {/* Box 2: components */}
            <div className="bg-white text-[#111827] font-extrabold text-[1.8rem] sm:text-[2.2rem] tracking-tight px-6 sm:px-10 py-4 sm:py-5 border-[2.5px] border-[#111827] rounded-[10px] shadow-sm relative z-10 w-[240px] sm:w-[280px] text-center">
              components
            </div>
          </div>

          {/* Connecting SVG Arrow */}
          <div className="absolute -right-[46px] sm:-right-[55px] top-[67px] w-[55px] sm:w-[70px] h-[90px] pointer-events-none z-0 hidden lg:block">
            <svg width="100%" height="100%" viewBox="0 0 70 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
              {/* Bezier curve from dot (0, 0) to bottom edge (5, 86) */}
              <path d="M 0 0 C 60 5, 80 86, 8 86" stroke="#111827" strokeWidth="2.5" fill="transparent" strokeLinecap="round" />
              {/* Arrow head pointing into the box */}
              <path d="M 16 77 L 4 86 L 16 95" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Layout: Grid of Pill Tags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 w-full max-w-[650px]">
          {[ 
            'Hero', 'Menu', 'Content', 'Rich Content', 
            'Process', 'Metrics', 'Logo', 'Team', 
            'FAQ', 'Gallery', 'Blog', 'CTA', 
            'Footer', 'Privacy Policy', 'Header', '404 Page'
          ].map(tag => (
            <div 
              key={tag} 
              className="bg-white border border-[#E5E7EB] rounded-[8px] py-3.5 px-3 flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.01)] transition-all hover:border-gray-300 hover:shadow-md cursor-pointer"
            >
              <span className="text-[#4B5563] font-medium text-[0.8rem] sm:text-[0.85rem] whitespace-nowrap">
                {tag}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
