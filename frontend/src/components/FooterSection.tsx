import { Link } from "@tanstack/react-router";

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
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 flex">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M4 16L16 4l12 12-12 12L4 16z" fill="url(#paint_logo_ft)" />
                <path d="M8 16L16 8l8 8-8 8-8-8z" fill="#fff" opacity="0.3" />
                <defs>
                  <linearGradient id="paint_logo_ft" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="0.5" stopColor="#9333EA" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-extrabold text-[1rem] tracking-tighter text-black uppercase">
              FIGCOMPONENTS
            </span>
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
