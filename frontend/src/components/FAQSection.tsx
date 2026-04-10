import { useState } from "react";
import type { ReactNode } from "react";

interface FAQ {
  id: number;
  question: ReactNode;
  answer: ReactNode;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: <>How is <span className="text-[#a855f7]">fig</span>component different from other libraries?</>,
    answer: <><span className="text-[#a855f7]">fig</span>component components are fully compatible with Figma, ensuring seamless consistency across all your platforms and projects</>
  },
  {
    id: 2,
    question: <>What is the Inspiration library?</>,
    answer: <>The Inspiration library provides a curated collection of beautiful layouts and UI patterns to kickstart your next project without starting from scratch.</>
  },
  {
    id: 3,
    question: <>How many components does <span className="text-[#a855f7]">fig</span>component offer?</>,
    answer: <>We currently offer over 100+ precision-crafted components across numerous categories, with 300 more coming this summer.</>
  },
  {
    id: 4,
    question: <>What kind of support can I expect from <span className="text-[#a855f7]">fig</span>component?</>,
    answer: <>We provide comprehensive documentation, community forums, and 24/7 dedicated support for all our premium subscribers.</>
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full max-w-[900px] mx-auto flex flex-col items-center py-16 lg:py-24 px-4 md:px-8 relative z-20">
      
      {/* Pill Badge */}
      <div className="bg-[#ebd5ff] text-[#9b41ee] font-semibold text-[0.75rem] px-5 py-1.5 rounded-full mb-8 tracking-wider">
        FAQ
      </div>
      
      {/* Title */}
      <h2 className="text-[#111827] font-extrabold text-[3.2rem] lg:text-[3.8rem] leading-[1.1] tracking-tight mb-16 text-center">
        Frequently Asked<br />Question
      </h2>

      {/* Accordion List */}
      <div className="flex flex-col gap-4 w-full">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          
          return (
            <div 
              key={faq.id}
              onClick={() => toggleOpen(faq.id)}
              className={`cursor-pointer transition-colors duration-200 rounded-[14px] p-6 lg:px-8 ${
                isOpen 
                  ? "bg-white border-[1px] border-[#a855f7] shadow-[0_4px_20px_rgba(0,0,0,0.03)]" 
                  : "bg-[#ececed] border-[1px] border-transparent hover:bg-[#e4e5e7]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111827] text-[1rem] md:text-[1.1rem]">
                  {faq.question}
                </h3>
                
                {/* Plus / Minus Icon */}
                <div className={`shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center ml-6 transition-colors duration-200 ${
                  isOpen ? "bg-[#16a34a]" : "bg-[#111827]"
                }`}>
                  {isOpen ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="4" x2="12" y2="20"></line>
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Answer Content */}
              {isOpen && (
                <div className="mt-4 pr-12 text-[#6B7280] text-[0.95rem] leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
