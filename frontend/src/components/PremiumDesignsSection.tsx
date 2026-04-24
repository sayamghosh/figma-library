import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  {
    title: "Corporate Leasing",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
    description: "Efficiently integrate cutting-edge tech solutions for streamlined infrastructure.",
  },
  {
    title: "Asset Management",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
    description: "Boost online presence and engagement through strategic digital enhancements.",
  },
  {
    title: "Investment Consulting",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    description: "From the towering skyscrapers of downtown LA to the tranquil residential.",
  },
  {
    title: "Digital Transformation",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
    description: "Accelerate growth through advanced technology and digital innovation.",
  },
  {
    title: "Strategic Planning",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80",
    description: "Detailed roadmaps to ensure long-term success and market leadership.",
  },
  {
    title: "Market Analysis",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
    description: "In-depth insights into market trends and consumer behavior.",
  }
];

export function PremiumDesignsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = services.length - itemsPerPage;

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="w-full bg-[#F8F9FB] py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 xl:gap-8">
        
        {/* Left Column */}
        <div className="w-full xl:w-[35%] flex flex-col items-start pt-4 xl:pt-20 shrink-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#111827] font-extrabold text-[3.5rem] sm:text-[4.5rem] lg:text-[5rem] leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Premium <span className="text-[#805AF5]">Designs</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#475569] text-[1.05rem] leading-[1.7] font-medium max-w-[480px] mb-10"
          >
            Premium design seamlessly merges superior materials, intuitive functionality, and elegant aesthetics. It prioritizes meticulous attention to detail and user experience to maximize the product's value.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 rounded-full border-2 border-[#805AF5] flex items-center justify-center text-[#805AF5] hover:bg-[#805AF5] hover:text-white transition-colors group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 7H17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {/* Right Column - The Big Card Carousel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full xl:w-[65%] bg-[#FFFCF8] rounded-[32px] p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#F1EBE4] overflow-hidden"
        >
          {/* Header of the card */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
            <h3 className="font-serif text-[#2D1B11] text-[2rem] sm:text-[2.5rem] leading-[1.1] tracking-tight max-w-[400px]">
              WHAT WE OFFER: <br/> OUR SERVICES
            </h3>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="w-12 h-12 rounded-full bg-[#FF4500] flex items-center justify-center text-white hover:bg-[#E03E00] transition-colors shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Viewport */}
          <div className="relative overflow-hidden">
            <motion.div 
              animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex gap-6"
              style={{ width: "100%" }}
            >
              {services.map((service, idx) => (
                <div 
                  key={idx}
                  className="min-w-[calc(33.333%-1rem)] flex flex-col group cursor-pointer"
                >
                  <div className="aspect-[4/5] rounded-[16px] overflow-hidden mb-5">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif text-[#2D1B11] text-[1.25rem] font-medium mb-2">
                    {service.title}
                  </h4>
                  <p className="text-[#64748B] text-[0.85rem] leading-[1.6] mb-4 flex-1 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#111827] text-[0.75rem] font-bold tracking-wider border-b border-[#111827] pb-1 group-hover:text-[#805AF5] group-hover:border-[#805AF5] transition-colors">
                      LEARN MORE
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
