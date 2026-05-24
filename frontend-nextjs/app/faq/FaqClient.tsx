"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { Plan } from "../../api/plans";

interface FaqItem {
  question: string;
  answer: string[];
}

const faqs: FaqItem[] = [
  {
    question: "What is FigComponents Figma?",
    answer: [
      "FigComponents is a premium Figma UI kit and design system with pre-designed components, typography styles, color palettes, and website sections that help designers build clean, high-quality interfaces rapidly.",
    ],
  },
  {
    question: "Why do I need a UI kit or component library?",
    answer: [
      "It saves hundreds of hours because you do not need to build common elements like buttons, inputs, navigation bars, and modals from scratch.",
      "It keeps designs consistent with reliable spacing, typography, and UX patterns, and gives you a strong foundation for scalable client or product work.",
    ],
  },
  {
    question: "Does FigComponents include the new Figma features?",
    answer: [
      "Yes. The kit is updated to support modern Figma features including Variables, Auto Layout 5.0, Component Properties, and Advanced Prototyping.",
    ],
  },
  {
    question: "What is the difference between the three versions?",
    answer: [
      "The Free version is a lightweight kit for testing the structure and quality.",
      "The Pro Individual version includes the complete component and page library for a single user.",
      "The Team or Enterprise version includes the full library with multi-user licensing for team collaboration.",
    ],
  },
  {
    question: "Is there a dark mode version of the kit?",
    answer: [
      "Yes. The Pro version includes dark mode styling integrated through Figma variables or separate page styles so you can switch between light and dark themes.",
    ],
  },
  {
    question: "Is there a free version available?",
    answer: ["Yes, there is a free version available so you can try the setup before upgrading."],
  },
  {
    question: "What does the free version include?",
    answer: [
      "It includes foundational styles, core components like buttons, alerts, and inputs, plus selected preview landing page sections.",
    ],
  },
  {
    question: "How do I sign in to my account?",
    answer: [
      "Sign in using the account credentials or email address you used during checkout.",
    ],
  },
  {
    question: "Why can't I sign in using my email?",
    answer: [
      "This usually happens if there is a typo in the email used during purchase, or if you are checking a different platform than the one used at checkout.",
    ],
  },
  {
    question: "Why didn't I receive my sign-in email or code (OTP)?",
    answer: [
      "Check your Spam, Junk, or Promotions folders.",
      "Make sure you are checking the exact email address used at checkout.",
      "Wait a few minutes because email delivery can sometimes be delayed.",
    ],
  },
  {
    question: "What does lifetime access mean?",
    answer: [
      "It means you pay once and get permanent access to the version you purchased, including future updates and improvements to that kit.",
    ],
  },
  {
    question: "How do I access the files and updates after purchasing?",
    answer: [
      "Use your original download link or account library. The latest Figma file or community link will be available there.",
    ],
  },
  {
    question: "How can I find my receipt email?",
    answer: [
      "Search your inbox for keywords like FigComponents, Figma components, Gumroad, Lemon Squeezy, or the email address used at checkout.",
    ],
  },
  {
    question: "Why don't my PDF links work anymore?",
    answer: [
      "Older download PDFs may include expired or deprecated links. Log into your purchase dashboard to access the latest file links.",
    ],
  },
  {
    question: "Do I need to know how to use Figma?",
    answer: [
      "Yes. You should understand Figma basics like layers, components, instances, and styles to use the kit effectively.",
    ],
  },
  {
    question: "Do I need to use variables?",
    answer: [
      "No, but it is recommended. Variables make it easier to manage colors, spacing, rounding, and theme switching.",
    ],
  },
  {
    question: "How does support work?",
    answer: [
      "Support is provided for purchase troubleshooting, license questions, and broken file links. It does not usually include general Figma training or custom design work.",
    ],
  },
  {
    question: "Do you provide video tutorials?",
    answer: [
      "The kit includes documentation inside the Figma file, and video overviews or tips may be shared to help you use the layout system.",
    ],
  },
  {
    question: "Do you provide an education discount?",
    answer: [
      "Yes. Students, teachers, and academic staff can usually request an education discount with a valid education email or proof of enrollment.",
    ],
  },
  {
    question: "Do I need to pay for Figma if I'm a student?",
    answer: [
      "Figma offers its own Education plan for verified students and educators. This is separate from FigComponents.",
    ],
  },
  {
    question: "Can I use FigComponents for commercial projects?",
    answer: [
      "Yes. You can use the kit to build websites, apps, and client projects that generate revenue.",
    ],
  },
  {
    question: "Can I use FigComponents for multiple projects?",
    answer: [
      "Yes. The license allows use across unlimited personal and client projects.",
    ],
  },
  {
    question: "What is a user?",
    answer: [
      "A user is any designer, developer, manager, or team member who can open, edit, or extract assets from the core Figma file.",
    ],
  },
  {
    question: "Do I need a team license?",
    answer: [
      "Yes, if more than one person needs access to open, edit, or publish the core library file in your team workspace.",
    ],
  },
  {
    question: "Can I use FigComponents with more than 12 users?",
    answer: [
      "Yes. Larger teams should use an Enterprise or Custom Team License that matches their seat count.",
    ],
  },
  {
    question: "Can I upgrade to a team or enterprise license?",
    answer: [
      "Yes. You can usually upgrade by paying the price difference through support or the available checkout upgrade path.",
    ],
  },
  {
    question: "Can I use FigComponents to create a similar product?",
    answer: [
      "No. You cannot use the kit to create a competing UI kit, template framework, or stock asset marketplace item for resale.",
    ],
  },
  {
    question: "Is it a one-time purchase?",
    answer: ["Yes. It is a one-time purchase with no recurring monthly or annual subscription."],
  },
  {
    question: "Do I need to pay for Figma?",
    answer: [
      "No. You can import and use the kit on Figma's free starter plan, though paid Figma plans unlock shared team libraries.",
    ],
  },
  {
    question: "Are payments secure?",
    answer: [
      "Yes. Payments are processed through secure checkout providers using industry-standard encryption.",
    ],
  },
  {
    question: "Can I purchase via PayPal, Alipay, or WeChat Pay?",
    answer: [
      "PayPal availability depends on the checkout provider. Alipay or WeChat Pay options depend on regional payment settings.",
    ],
  },
  {
    question: "Can I get an invoice?",
    answer: [
      "Yes. Your receipt email should include an invoice link where you can add company details, address, and tax information.",
    ],
  },
  {
    question: "What is your refund policy?",
    answer: [
      "Because digital files can be downloaded instantly, refunds are generally not granted unless there is a duplicate purchase or payment error. Try the free version first if you are unsure.",
    ],
  },
  {
    question: "Can I split up the Figma library into smaller files?",
    answer: [
      "Yes. You can copy specific page contents into separate files if the full library is too large for your workflow.",
    ],
  },
  {
    question: "Why isn't the Figma library split up already?",
    answer: [
      "It is delivered as one unified file so component dependencies, variables, and cross-references stay intact.",
    ],
  },
  {
    question: "Is there a version for Framer or Sketch?",
    answer: [
      "The kit is built natively for Figma. Related frameworks may exist for platforms like Webflow or Framer, but Sketch is not officially supported.",
    ],
  },
  {
    question: "Is FigComponents affiliated with Figma or Tailwind?",
    answer: [
      "No. FigComponents is an independent product and is not legally affiliated with or endorsed by Figma, Inc. or Tailwind Labs.",
    ],
  },
  {
    question: "How do I access the Webflow Library?",
    answer: [
      "The Webflow version is usually accessed through the connected component platform or account dashboard links.",
    ],
  },
  {
    question: "Does the Webflow Library include every FigComponents component?",
    answer: [
      "It includes most core layout components, sections, and structural elements translated into clean Webflow HTML and CSS.",
    ],
  },
  {
    question: "What is Relume Library?",
    answer: [
      "Relume Library is a Webflow component marketplace for layout sections and reusable website blocks.",
    ],
  },
  {
    question: "What is Finsweet Client-first?",
    answer: [
      "It is a popular Webflow class-naming convention and style guide framework for clean, organized, scalable Webflow projects.",
    ],
  },
  {
    question: "How does support work for the Webflow Library?",
    answer: [
      "Support for code or integration issues is usually handled by the platform hosting the components or the related Webflow documentation channels.",
    ],
  },
  {
    question: "Can I use it for commercial Webflow projects?",
    answer: [
      "Yes. You can build production-ready commercial websites for clients using the Webflow components.",
    ],
  },
  {
    question: "Can I use this to create and sell a product?",
    answer: [
      "You can build and sell a functional product, but you cannot package the components or code as a competing template, theme, or asset kit.",
    ],
  },
  {
    question: "Is FigComponents affiliated with Webflow?",
    answer: [
      "No. It is an independent project designed to integrate with Webflow workflows, but it is not an official Webflow corporate product.",
    ],
  },
];

const fallbackPlans: Plan[] = [
  {
    _id: "fallback-basic",
    name: "pro_starter",
    displayName: "Basic",
    description: "Simple structures, leading to a focus on user experience.",
    price: 9900,
    durationDays: 180,
    componentLimit: 100,
    isActive: true,
    sortOrder: 1,
    features: [
      "100 Components",
      "Figma variables",
      "Dark mode variables",
      "Component properties",
      "Interactive components",
      "Auto Layout 5.0",
    ],
  },
  {
    _id: "fallback-advanced",
    name: "pro_ultimate",
    displayName: "Advanced",
    description: "Highly customized layout to help you stand out.",
    price: 19900,
    durationDays: 180,
    componentLimit: 250,
    isActive: true,
    sortOrder: 2,
    features: [
      "250 Components",
      "Figma variables",
      "Dark mode variables",
      "Component properties",
      "Interactive components",
      "Auto Layout 5.0",
    ],
  },
];

function formatPrice(price: number) {
  return Math.floor(price / 100).toFixed(2);
}

function FaqIcon({ open }: { open: boolean }) {
  if (open) {
    return <span className="h-[18px] w-[18px] rounded-full bg-[#23d234]" />;
  }

  return (
    <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-black text-white">
      <Plus size={12} strokeWidth={3} />
    </span>
  );
}

function PricingCard({
  plan,
  selected,
  dark = false,
  onSelect,
}: {
  plan: Plan;
  selected: boolean;
  dark?: boolean;
  onSelect: () => void;
}) {
  const features = (plan.features || []).slice(0, 6);
  const title = `${plan.displayName || plan.name} plan`;

  return (
    <article
      onClick={onSelect}
      className={`relative min-h-[214px] cursor-pointer overflow-hidden rounded-[7px] p-7 transition-all duration-300 ${
        dark ? "bg-black text-white" : "bg-[#f7f8fa] text-black"
      } ${selected ? "lg:min-h-[252px]" : ""}`}
    >
      <div className={selected ? "lg:max-w-[44%]" : ""}>
        <h3 className="text-[14px] font-semibold leading-none">
          {title}
        </h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className={`text-[38px] font-bold leading-none ${dark ? "text-[#9FE870]" : "text-black"}`}>
            &#8377; {formatPrice(plan.price)}
          </span>
        </div>
        <p className={`mt-8 max-w-[240px] text-[12px] font-medium leading-[1.7] ${dark ? "text-white/55" : "text-black/45"}`}>
          {plan.description}
        </p>
        <Link
          href="/pricing"
          onClick={(event) => event.stopPropagation()}
          className={`mt-5 inline-flex h-[35px] items-center gap-4 rounded-full py-1 pl-5 pr-1 text-[12px] font-semibold ${
            dark ? "bg-[#9FE870] text-black" : "bg-white text-black"
          }`}
        >
          Buy Now
          <span className={`grid h-7 w-7 place-items-center rounded-full ${dark ? "bg-white text-black" : "bg-[#9FE870] text-black"}`}>
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </Link>
      </div>

      {selected && (
        <ul className="mt-8 grid gap-4 text-[12px] font-medium lg:absolute lg:right-10 lg:top-1/2 lg:mt-0 lg:w-[38%] lg:-translate-y-1/2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Check size={14} strokeWidth={2.5} className={dark ? "text-white" : "text-black"} />
              <span className={dark ? "text-white/80" : "text-black/75"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function PricingSection({ plans }: { plans: Plan[] }) {
  const [selectedPlanName, setSelectedPlanName] = useState("pro_ultimate");
  const availablePlans = plans.length > 0 ? plans : fallbackPlans;
  const basicPlan = availablePlans.find((plan) => plan.name === "pro_starter") || fallbackPlans[0];
  const advancedPlan = availablePlans.find((plan) => plan.name === "pro_ultimate") || fallbackPlans[1];

  return (
    <section className="w-full bg-white px-5 pb-16 pt-7 sm:px-8 lg:pb-20">
      <div className="mx-auto w-full max-w-[860px]">
        <div className="mx-auto max-w-[520px] text-center">
          <p className="text-[12px] font-medium text-[#5b5b5b]">Pricing &amp; Plans</p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.16] text-black md:text-[36px]">
            Developing strong ideas into
            <br />
            relatable and concrete
          </h2>
        </div>

        <div className={`mt-12 grid gap-5 transition-all duration-300 lg:items-stretch ${
          selectedPlanName === "pro_starter" ? "lg:grid-cols-[2.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_2.1fr]"
        }`}>
          <PricingCard
            plan={basicPlan}
            selected={selectedPlanName === "pro_starter"}
            onSelect={() => setSelectedPlanName("pro_starter")}
          />
          <PricingCard
            plan={advancedPlan}
            selected={selectedPlanName === "pro_ultimate"}
            dark
            onSelect={() => setSelectedPlanName("pro_ultimate")}
          />
        </div>
      </div>
    </section>
  );
}

export default function FaqClient({ initialPlans }: { initialPlans: Plan[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="w-full bg-white text-black">
      <section className="w-full px-5 pb-12 pt-[78px] sm:px-8 lg:pb-16">
        <div className="mx-auto w-full max-w-[860px]">
          <div className="text-center">
            <h1 className="text-[42px] font-bold leading-[1.16] text-[#07150c] md:text-[52px]">
              Frequently Asked
              <br />
              Questions
            </h1>
            <p className="mt-4 text-[12px] font-medium text-black">
              Get answers to commonly asked questions.
            </p>
          </div>

          <div className="mt-[70px] flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <article
                  key={faq.question}
                  className={`rounded-[11px] transition-all duration-200 ${
                    open
                      ? "border border-[#6e2ccf] bg-white px-5 py-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                      : "bg-[#f1f1f1] px-5 py-[21px]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-5 text-left"
                  >
                    <span className="text-[14px] font-semibold leading-[1.35] text-black">
                      {faq.question}
                    </span>
                    <FaqIcon open={open} />
                  </button>

                  {open && (
                    <div className="mt-5 max-w-[760px] space-y-3 pr-9 text-[12px] font-medium leading-[1.75] text-black">
                      {faq.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PricingSection plans={initialPlans} />
    </main>
  );
}
