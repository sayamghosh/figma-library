import { Link } from "@tanstack/react-router";

export function FooterSection() {
  return (
    <footer className="w-full bg-white h-[253px] flex justify-center items-center border-t border-gray-100 font-manrope">
      <div className="w-[1280px] max-w-full px-4 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Part: Brand Info (Aligns with Premium Designs text) */}
        <div className="w-full md:w-[45%] flex flex-col justify-center pr-0 md:pr-12">
          <p className="text-[#4B5563] text-[14px] leading-[1.6] max-w-[380px] mb-8">
            <span className="text-[#A855F7] font-bold">fig</span>components.site creates premium, highly customizable Figma components. Our reusable UI elements are specifically designed to accelerate your workflow, save time, and elevate design consistency!
          </p>

          <p className="text-[#111827] text-[13px] font-medium">
            © Copyright 2026 <span className="text-[#A855F7] font-bold">fig</span>components.site | All rights reserved
          </p>
        </div>

        {/* Right Part: Link Groups (Aligns with Premium Designs image) */}
        <div className="w-full md:w-[50%] flex justify-end items-start gap-[50px]">
          {/* Column 1: Information */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[#111827] text-[16px] font-bold mb-2">Information</h4>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">SignUp</Link>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Join Community</Link>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Learning</Link>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Newsletter</Link>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[#111827] text-[16px] font-bold mb-2">Platform</h4>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Term of Use</Link>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">About</Link>
            <Link to="/" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Career</Link>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[#111827] text-[16px] font-bold mb-2">Social Media</h4>
            <a href="#" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Youtube</a>
            <a href="#" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Instagram</a>
            <a href="#" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">Facebook</a>
            <a href="#" className="text-[#4B5563] text-[14px] hover:text-[#A855F7] transition-colors">X (Twitter)</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
