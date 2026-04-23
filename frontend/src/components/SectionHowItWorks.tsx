import { motion } from "framer-motion";

export function SectionHowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Browse",
      description: "Explore All Components, or All Inspiration"
    },
    {
      number: "2",
      title: "Copy",
      description: "Copy from 100+ designs (50 more coming this summer)"
    },
    {
      number: "3",
      title: "Paste",
      description: "Paste into your project. Works best on app versions"
    }
  ];

  return (
    <section className="w-full max-w-[1200px] mx-auto py-16 sm:py-24 px-4 md:px-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 sm:mb-16"
      >
        <h2 className="text-[#111827] font-outfit font-extrabold text-[2.5rem] sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4rem] leading-[1.1] tracking-tight mb-4">
          How it <span className="text-[#805AF5]">Works</span>
        </h2>
        <p className="text-[#64748B] text-[0.95rem] sm:text-[1.05rem] font-medium">
          Simple 3 step process to get you started
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col relative group"
          >
            {/* Card Background / Container */}
            <div className="aspect-[4/3.5] bg-[#F8F7FF] rounded-[24px] p-4 sm:p-5 relative flex items-stretch overflow-hidden">
              
              {/* Abstract Background Grid Pattern (Matching the image) */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0.5 p-0.5">
                 {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-[#F0EDFF] w-full h-full rounded-sm opacity-50" />
                 ))}
              </div>

              {/* Inner White Box */}
              <div className="relative z-10 w-full bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-8 flex flex-col justify-start">
                
                {/* Step Number */}
                <div className="bg-[#F1F5F9] text-[#475569] w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <span className="font-extrabold text-[1.4rem] font-sans">{step.number}</span>
                </div>
                
                {/* Step Title */}
                <h3 
                  className="font-extrabold tracking-tight mb-3"
                  style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '36px', lineHeight: '1.2', color: '#161616' }}
                >
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-[#161616] text-[0.95rem] leading-[1.6] font-medium pr-4">
                  {step.description}
                </p>
                
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
