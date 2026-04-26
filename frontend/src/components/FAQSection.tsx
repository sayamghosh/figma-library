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

  return (
    <section className="w-full max-w-[900px] mx-auto flex flex-col items-center py-12 sm:py-16 lg:py-24 px-4 md:px-8 relative z-20">



      {/* Title */}
      <h2 
        className="text-[#111827] font-bold tracking-tight mb-10 sm:mb-14 text-center font-outfit"
        style={{ fontSize: '48px', lineHeight: '60px' }}
      >
        Frequently Asked<br />Question
      </h2>

      {/* Accordion */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className={`cursor-pointer transition-colors duration-200 rounded-[12px] sm:rounded-[14px] p-5 sm:p-6 lg:px-8 ${
                isOpen
                  ? "bg-white border border-[#a855f7] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                  : "bg-[#ececed] border border-transparent hover:bg-[#e4e5e7]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-[#111827] text-[0.9rem] sm:text-[1rem] md:text-[1.05rem] leading-snug">
                  {faq.question}
                </h3>
                <div className={`shrink-0 w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] rounded-full flex items-center justify-center transition-colors duration-200 mt-0.5 ${
                  isOpen ? "bg-[#16a34a]" : "bg-[#111827]"
                }`}>
                  {isOpen ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                      <line x1="4" y1="12" x2="20" y2="12" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
                      <line x1="12" y1="4" x2="12" y2="20" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                    </svg>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="mt-3 sm:mt-4 pr-6 sm:pr-10 text-[#6B7280] text-[0.87rem] sm:text-[0.95rem] leading-relaxed">
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
