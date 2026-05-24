"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  excerpt: string;
  content: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "component-driven",
    title: "The Future of Component-Driven Development",
    date: "December 22, 2024",
    author: "Alex Rivera",
    category: "Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Discover how reusable components are changing the landscape of modern web development and saving teams countless hours.",
    content: [
      "Component-driven development (CDD) is no longer just a buzzword—it is the foundational methodology for modern web development. By breaking down complex interfaces into manageable, reusable building blocks, teams can scale their applications with unprecedented speed and consistency.",
      "The primary advantage of CDD is reusability. Instead of rewriting the same button or navigation bar code across multiple pages, developers create a single, robust component. This component serves as a single source of truth, meaning any design updates or bug fixes only need to be applied in one place.",
      "As tools like Next.js and React continue to evolve, the integration between design files and code components is becoming seamless. Designers design components, and developers build them. The future lies in minimizing the friction between these two states."
    ]
  },
  {
    id: "auto-layout",
    title: "Mastering Auto Layout in Figma",
    date: "December 18, 2024",
    author: "Sarah Chen",
    category: "Design",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1200",
    excerpt: "A deep dive into creating responsive, fluid designs using Figma's powerful Auto Layout features.",
    content: [
      "Auto Layout is arguably Figma's most powerful feature for UI/UX designers. It allows you to create designs that grow, shrink, and reflow as their contents change. This closely mirrors how Flexbox works in CSS, making handoff to developers incredibly smooth.",
      "To truly master Auto Layout, you need to understand the relationship between fixed, hugging, and filling containers. A parent container set to 'Hug' will wrap tightly around its children, while a child set to 'Fill container' will expand to take up any available space.",
      "When you start nesting Auto Layout frames, you unlock the ability to build complex, responsive components like data tables and navigation menus that behave predictably across any screen size."
    ]
  },
  {
    id: "design-systems",
    title: "Design Systems: Why Your Team Needs One",
    date: "December 15, 2024",
    author: "Marcus Johnson",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Scaling consistency across products is impossible without a centralized design system. Here is how to get started.",
    content: [
      "A design system is more than just a UI kit; it's a complete set of standards intended to manage design at scale using reusable components and patterns. It bridges the gap between design and development by providing a shared language.",
      "Without a design system, as your product grows and your team expands, inconsistencies inevitably creep in. You might end up with dozens of slightly different button styles or conflicting color hex codes. This not only confuses users but drastically slows down the development process.",
      "Building a design system requires an upfront investment of time, but the long-term ROI is massive. Start small: audit your current UI, establish a core color palette, typography scale, and build your most fundamental components first."
    ]
  },
  {
    id: "dark-mode",
    title: "Dark Mode Best Practices for Web Apps",
    date: "December 10, 2024",
    author: "Elena Rodriguez",
    category: "UX/UI",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Creating accessible and beautiful dark themes goes beyond simply inverting your colors.",
    content: [
      "Dark mode is no longer an optional feature—it's an expectation. However, designing a great dark mode is trickier than just turning white backgrounds black and black text white. True dark mode requires a carefully considered color palette.",
      "Avoid pure black (#000000). Pure black backgrounds with pure white text cause high contrast that can strain the eyes. Instead, use dark grays (like #121212) which allow you to express elevation and depth through subtle shadows and lighter gray surface colors.",
      "When transitioning your brand colors to dark mode, you'll often need to desaturate them. Highly saturated colors vibrate against dark backgrounds, causing visual fatigue. Softer, pastel-leaning tones work much better for accents and interactive states."
    ]
  },
  {
    id: "design-code-gap",
    title: "Bridging the Gap Between Design and Code",
    date: "December 05, 2024",
    author: "David Kim",
    category: "Collaboration",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
    excerpt: "How modern tooling and standardized processes are bringing designers and developers closer than ever.",
    content: [
      "The handoff process from design to development has historically been a point of friction. Designers toss static images over the wall, and developers struggle to interpret the exact specifications, leading to endless feedback loops.",
      "Today, tools are breaking down this wall. With design tokens, we can define our core design decisions (colors, spacing, typography) as data. When a designer changes a token in Figma, it can automatically update the corresponding CSS variable in the codebase.",
      "By adopting a shared vocabulary and utilizing platforms that translate design constraints into code structure, teams can spend less time arguing over pixel nudges and more time building delightful user experiences."
    ]
  }
];

export default function BlogPage() {
  const [activeSection, setActiveSection] = useState(blogPosts[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header

      for (const post of blogPosts) {
        const el = document.getElementById(post.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(post.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for sticky nav
      window.scrollTo({
        top: top,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="w-full bg-[#fcfdfa] text-[#111111] font-sans">
      {/* Main Content Layout Container */}
      <div className="w-full max-w-[1344px] mx-auto bg-white border-x border-[#e5e7eb] grid lg:grid-cols-[280px_1fr] items-start relative min-h-screen">
        
        {/* Sticky Sidebar for Recent Posts/Navigation */}
        <aside className="hidden lg:block sticky top-[60px] h-[calc(100vh-60px)] bg-white border-r border-[#e5e7eb] py-8 px-6 overflow-y-auto self-start">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Articles</p>
          <nav className="flex flex-col gap-2">
            {blogPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => handleScrollTo(post.id)}
                className={`text-left text-[14px] font-medium py-3 px-3 rounded-lg transition-all flex flex-col gap-1 ${
                  activeSection === post.id
                    ? "bg-[#9FE870]/20 text-[#2c5114]"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                <span className={`line-clamp-2 ${activeSection === post.id ? 'font-bold' : 'font-medium'}`}>
                  {post.title}
                </span>
                <span className="text-[12px] opacity-70">{post.date}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Blog Content */}
        <div className="p-6 md:p-12 lg:p-16 space-y-24 max-w-[900px] w-full mx-auto">
          
          {/* Header */}
          <div className="space-y-4 pb-4">
            <span className="text-[12px] font-bold text-[#54992e] uppercase tracking-wider bg-[#54992e]/10 px-3.5 py-1.5 rounded-full inline-block">
              Insights & News
            </span>
            <h1 className="font-outfit text-[38px] md:text-[50px] font-bold tracking-tight text-[#111111] leading-none mt-2">
              Our Blog
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#565656] mt-4 max-w-2xl">
              Thoughts, tutorials, and insights about design systems, component-driven development, and the future of front-end engineering.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Blog Posts List */}
          <div className="space-y-24">
            {blogPosts.map((post, idx) => (
              <article key={post.id} id={post.id} className="scroll-mt-32 space-y-8 group">
                
                {/* Image Container */}
                <div className="w-full h-[300px] sm:h-[400px] relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-transform duration-500 group-hover:shadow-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-black text-[13px] font-bold px-4 py-2 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Header */}
                <div className="space-y-4">
                  <h2 className="font-outfit text-[28px] md:text-[36px] font-bold text-black leading-tight transition-colors group-hover:text-[#2c5114]">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-[14px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User size={16} />
                      {post.author}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {post.date}
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-6">
                  <p className="text-[18px] leading-[1.6] text-black font-medium border-l-4 border-[#9FE870] pl-5 italic">
                    {post.excerpt}
                  </p>
                  
                  {post.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-[16px] md:text-[17px] leading-[1.8] text-[#4d4d4d]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Article Footer */}
                <div className="pt-8 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-[#9FE870] hover:text-black transition-colors">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    </button>
                    <span className="text-[14px] font-medium text-gray-500">Share this article</span>
                  </div>
                  <button className="text-[15px] font-bold text-[#2c5114] hover:text-black flex items-center gap-1 transition-colors">
                    Read more articles <ArrowRight size={18} className="ml-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
