import { motion } from "framer-motion";

export function Group18() {
  const cards = [1, 2, 3, 4];

  return (
    <section className="w-full bg-[#F8F9FB] py-20 sm:py-28 px-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="font-outfit text-[#111827] font-extrabold text-[2.2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.5rem] leading-[1.1] tracking-tight flex flex-col items-center">
            <span className="block">Build Faster with</span>
            <span className="flex items-center justify-center gap-3 sm:gap-5 mt-1 sm:mt-2">
               <div className="w-[3.8rem] sm:w-[4.8rem] h-[2rem] sm:h-[2.6rem] bg-[#D1D5DB] rounded-full flex items-center px-1.5 shadow-inner relative group cursor-pointer transition-colors hover:bg-[#C4C9D4] shrink-0">
                  <div className="w-[1.6rem] sm:w-[2rem] h-[1.6rem] sm:h-[2rem] bg-white rounded-full shadow-md" />
                  {/* Cursor Indicator */}
                  <div className="absolute -bottom-4 -right-1 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none transition-transform group-hover:scale-110 z-10">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                      <path d="M5.5 2.5L20.5 10.5L13.5 12.5L16.5 19.5L12.5 21.5L9.5 14.5L4.5 18.5V2.5Z" fill="white" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
               </div>
               <span className="flex items-center gap-2 sm:gap-4">
                 <span>100+</span>
                 <span className="text-[#805AF5]">Components</span>
                 <span>Prebuilt</span>
               </span>
            </span>
          </h2>
        </motion.div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {cards.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white border border-[#F1F5F9] rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] cursor-pointer group"
            >
              {/* Thumbnail / Preview Area */}
              <div className="aspect-[4/3.2] bg-[#EBE9FE] rounded-[24px] mb-8 relative flex items-center justify-center overflow-hidden">
                {/* Browser Window Mockup */}
                <div className="w-[75%] h-[65%] bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
                   {/* Header */}
                   <div className="h-[22%] bg-[#F8FAFC] border-b border-[#F1F5F9] px-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0]" />
                   </div>
                   {/* Content */}
                   <div className="flex-1 p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#F1F5F9]" />
                        <div className="h-1.5 w-[40%] rounded-full bg-[#F1F5F9]" />
                      </div>
                      <div className="w-full h-1/2 rounded-lg bg-[#F1F5F9] mt-1" />
                   </div>
                </div>
                
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
              </div>

              {/* Text Content */}
              <div className="text-center pb-2">
                <h3 className="text-[#111827] font-bold text-[1.1rem] mb-1.5 tracking-tight group-hover:text-[#805AF5] transition-colors">
                  Component
                </h3>
                <p className="text-[#94A3B8] text-[0.8rem] font-medium tracking-wide">
                  Browse 100+ Components
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
