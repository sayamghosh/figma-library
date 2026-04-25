import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { componentsApi } from "../api/components";

export function PremiumDesignsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["components", "latest"],
    queryFn: () => componentsApi.list("", ""),
  });

  const latestComponent = data?.items?.[0];

  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-[1280px] max-w-full px-4 min-h-[600px] flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Column */}
        <div className="w-full md:w-[45%] flex flex-col items-start pr-0 md:pr-12">
          <h2 className="font-outfit font-bold text-[48px] text-[#111827] mb-6 leading-tight">
            Premium <span className="text-[#A855F7]">Designs</span>
          </h2>
          
          <p className="font-manrope font-normal text-[18px] text-[#4B5563] text-justify mb-10 leading-relaxed">
            Premium design seamlessly merges superior materials, intuitive functionality, and elegant aesthetics. It prioritizes meticulous attention to detail and user experience to maximize the product's value.
          </p>
          
          <Link to="/components" className="w-[64px] h-[64px] rounded-full border-2 border-[#A855F7] flex items-center justify-center text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-colors duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </div>

        {/* Right Column */}
        <Link 
          to="/components" 
          className="w-full md:w-[50%] h-[400px] bg-[#F5F3FF] rounded-[16px] overflow-hidden flex items-center justify-center group cursor-pointer border border-[#EBE9FE] hover:shadow-lg transition-all duration-300 relative"
        >
          {isLoading ? (
            <div className="animate-pulse w-full h-full bg-[#EAE6F9]" />
          ) : latestComponent?.previewImageUrl ? (
            <img 
              src={latestComponent.previewImageUrl} 
              alt={latestComponent.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
            />
          ) : (
            <span className="text-[#A855F7] font-semibold opacity-70">No components available</span>
          )}
        </Link>

      </div>
    </section>
  );
}
