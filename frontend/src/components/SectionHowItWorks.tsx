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
    <section className="w-full flex flex-col items-center justify-center py-20 bg-white">
      <div className="w-[1280px] max-w-full px-4 h-[600px] flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full mb-16">
          <h2 className="font-outfit font-bold text-[48px] text-[#111827] mb-2">
            How it <span className="text-[#A855F7]">Works</span>
          </h2>
          <p className="font-manrope font-normal text-[18px] text-[#4B5563]">
            Simple 3 step process to get you started
          </p>
        </div>

        {/* Card Section */}
        <div className="w-[1102px] max-w-full flex justify-between gap-[56px]">
          {steps.map((step) => (
            <div key={step.number} className="w-[330px] h-[280px] bg-[#F5F3FF] rounded-[24px] p-4 flex flex-col">
              {/* Inner White Box */}
              <div className="bg-white rounded-[16px] p-6 flex-1 flex flex-col justify-center mb-4">
                {/* Number */}
                <div className="w-[44px] h-[44px] bg-[#E2E8F0] rounded-[8px] flex items-center justify-center mb-2">
                  <span className="font-outfit font-extrabold text-[36px] text-[#64748B]">{step.number}</span>
                </div>
                {/* Title */}
                <h3 className="font-manrope font-extrabold text-[36px] text-[#111827]">
                  {step.title}
                </h3>
              </div>
              {/* Sub Heading (below white box) */}
              <p className="font-manrope font-normal text-[18px] text-[#4B5563] px-2 leading-[1.4]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
