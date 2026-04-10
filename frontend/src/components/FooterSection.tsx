import { Link } from "@tanstack/react-router";
import logoImg from "../assets/logo.svg";

export function FooterSection() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#FEF7F3] to-[#FDF4EE] pt-8 lg:pt-12 pb-16 lg:pb-24 relative z-0">
      
      {/* Divider Line */}
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 mb-12">
        <hr className="border-[#D1D5DB]" />
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-8">
        
        {/* Col 1: Brand Info (Takes up 5 columns on large screens) */}
        <div className="col-span-2 md:col-span-4 lg:col-span-5 flex flex-col items-start pr-4">
          <div className="flex items-center mb-6">
            <Link to="/">
              <img src={logoImg} alt="FigComponents Logo" className="h-[1.75rem] w-auto object-contain" />
            </Link>
          </div>
          
          <p className="text-[#4B5563] text-[0.85rem] leading-relaxed mb-10 max-w-[400px]">
             <span className="text-[#a855f7] font-semibold">figcomponents.site</span> creates premium, highly customizable Figma components. Our reusable UI elements are specifically designed to accelerate your workflow, save time, and elevate design consistency!
          </p>

          <p className="text-[#111827] text-[0.75rem] font-bold">
            © Copyright 2026 <span className="text-[#a855f7]">figcomponent.site</span> | All rights reserved
          </p>
        </div>

        {/* Col 2: Information */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h4 className="font-bold text-[#111827] text-[0.95rem] mb-4">Information</h4>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">SignUp</Link>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Join Community</Link>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Learning</Link>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Newsletter</Link>
        </div>

        {/* Col 3: Platform */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h4 className="font-bold text-[#111827] text-[0.95rem] mb-4">Platform</h4>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Term of Use</Link>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">About</Link>
          <Link to="/" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Career</Link>
        </div>

        {/* Col 4: Social Media */}
        <div className="col-span-2 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
          <h4 className="font-bold text-[#111827] text-[0.95rem] mb-4">Social Media</h4>
          <a href="#" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Youtube</a>
          <a href="#" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Instagram</a>
          <a href="#" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">Facebook</a>
          <a href="#" className="text-[#4B5563] text-[0.85rem] hover:text-[#9b41ee] transition-colors">X (Twitter)</a>
        </div>

      </div>
    </footer>
  );
}
