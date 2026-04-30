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
    <section className="relative z-20 w-full bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[960px] flex-col items-center">
        <h2 className="mb-10 text-center font-outfit text-[clamp(2.25rem,3.35vw,3.25rem)] font-bold leading-[1.16] tracking-normal text-[#111827] sm:mb-14">
          Frequently Asked<br />Question
        </h2>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={`cursor-pointer rounded-[12px] p-5 transition-colors duration-200 sm:rounded-[14px] sm:p-6 lg:px-8 ${
                  isOpen
                    ? "border border-[#a855f7] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                    : "border border-transparent bg-[#ececed] hover:bg-[#e4e5e7]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[0.9rem] font-bold leading-snug text-[#111827] sm:text-[1rem] md:text-[1.05rem]">
                    {faq.question}
                  </h3>
                  <div className={`mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 sm:h-[22px] sm:w-[22px] ${
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
                  <div className="mt-3 pr-6 text-[0.87rem] leading-relaxed text-[#6B7280] sm:mt-4 sm:pr-10 sm:text-[0.95rem]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
