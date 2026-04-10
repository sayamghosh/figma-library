export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Browse",
      description: "Explore All Components, or All Inspiration"
    },
    {
      number: "2",
      title: "Copy",
      description: "Copy from 500+ designs (300 more coming this summer)."
    },
    {
      number: "3",
      title: "Paste",
      description: "Paste into your project. Works best on app versions."
    }
  ];

  return (
    <section className="w-full max-w-[1100px] mx-auto flex flex-col py-16 lg:py-24 px-4 md:px-8 relative z-20">
      
      {/* Header */}
      <div className="flex flex-col mb-10 w-full">
        <h2 className="text-[#111827] font-syne font-extrabold text-[2.5rem] md:text-[3.2rem] tracking-tight mb-3 leading-[1.1]">
          How it Works
        </h2>
        <p className="text-[#4B5563] text-[0.95rem]">
          Simple 3 step process to get you started
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className="bg-[#F8F9FA] border border-[#D1D5DB] rounded-2xl p-8 flex flex-col shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            {/* Number Badge */}
            <div className="bg-[#E5E7EB] text-[#111827] w-10 h-10 rounded-md flex items-center justify-center mb-8 shadow-sm">
              <span className="font-extrabold text-[1.1rem]">{step.number}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-[#111827] font-extrabold text-[1.4rem] tracking-tight mb-2">
              {step.title}
            </h3>
            
            {/* Description */}
            <p className="text-[#4B5563] text-[0.85rem] leading-relaxed pr-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
