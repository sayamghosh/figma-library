import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import fcLogo from "../assets/fc-logo.png";

const features = [
  "Figma variables",
  "Dark mode variables",
  "Component properties",
  "Interactive components",
  "Auto Layout 5.0",
  "Single user license",
  "Design System",
];

const plans = [
  {
    name: "Basic",
    description: "Ideal for individuals who need quick access to basic features.",
    price: "99",
    duration: "180 Days",
    components: "100 Components",
    highlighted: false,
  },
  {
    name: "Advance",
    description: "Ideal for individuals who need advanced features and tools for client work.",
    price: "199",
    duration: "180 Days",
    components: "250 Components",
    highlighted: true,
  },
  {
    name: "Premium+",
    description: "Ideal for businesses who need personalized services and security for large teams.",
    price: "499",
    duration: "365 Days",
    components: "Unlimited Components",
    highlighted: false,
  },
];

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 2-2 58 58 0 0 1 15 0 2 2 0 0 1 2 2 24 24 0 0 1 0 10 2 2 0 0 1-2 2 58 58 0 0 1-15 0 2 2 0 0 1-2-2Z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  const items = [plan.components, ...features];

  return (
    <article
      className={
        plan.highlighted
          ? "flex min-h-[620px] flex-col rounded-[10px] bg-[#004304] px-7 py-9 text-white shadow-[0_15px_24px_rgba(49,91,204,0.18)] md:-mt-8"
          : "flex min-h-[560px] flex-col px-1 py-2 text-[#141414]"
      }
    >
      <h2 className="text-[20px] font-bold leading-none">{plan.name}</h2>
      <p
        className={
          plan.highlighted
            ? "mt-5 max-w-[270px] text-[14px] leading-[1.45] text-white/80"
            : "mt-5 max-w-[275px] text-[14px] leading-[1.45] text-[#86909c]"
        }
      >
        {plan.description}
      </p>

      <div className="mt-8 flex items-end gap-1.5">
        <span className="text-[47px] font-extrabold leading-[0.85] tracking-[-0.05em]">
          &#8377;{plan.price}
        </span>
        <span
          className={
            plan.highlighted
              ? "pb-1 text-[13px] font-medium text-white/65"
              : "pb-1 text-[13px] font-medium text-[#7d8590]"
          }
        >
          / {plan.duration}
        </span>
      </div>

      <button
        type="button"
        className={
          plan.highlighted
            ? "mt-9 h-[38px] w-full rounded-[3px] bg-white text-[13px] font-bold text-[#2761bd] shadow-sm"
            : "mt-9 h-[38px] w-full rounded-[2px] border border-[#356fff] bg-white text-[13px] font-bold text-[#2761bd]"
        }
      >
        Get Started Now
      </button>

      <ul className="mt-8 flex flex-col gap-[18px]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-4 text-[14px] font-medium">
            <span
              className={
                plan.highlighted
                  ? "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-[#4777c8]"
                  : "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef4ff] text-[#89a9ec]"
              }
            >
              <Check size={15} strokeWidth={2.3} />
            </span>
            <span className={plan.highlighted ? "text-white/78" : "text-[#2f3338]"}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SpatialitySection() {
  return (
    <section className="mx-auto mt-[150px] w-full max-w-[1320px] px-5">
      <h2 className="text-center text-[34px] font-extrabold tracking-[-0.035em] text-black md:text-[42px]">
        What&apos;s our spatiality!
      </h2>

      <div
        className="mt-12 overflow-hidden rounded-[7px] border border-[#e2e2e2] px-5 py-[70px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:py-[78px]"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: [
            "radial-gradient(ellipse 46% 67% at 100% 0%, rgba(159,232,112,0.98) 0%, rgba(171,239,127,0.9) 20%, rgba(213,255,188,0.54) 43%, rgba(255,255,255,0) 71%)",
            "radial-gradient(ellipse 50% 72% at 0% 100%, rgba(159,232,112,0.98) 0%, rgba(176,242,134,0.84) 24%, rgba(220,255,199,0.5) 46%, rgba(255,255,255,0) 74%)",
            "radial-gradient(ellipse 30% 45% at 18% 53%, rgba(226,255,210,0.34) 0%, rgba(255,255,255,0) 72%)",
            "radial-gradient(ellipse 38% 50% at 80% 42%, rgba(232,255,218,0.28) 0%, rgba(255,255,255,0) 68%)",
          ].join(", "),
        }}
      >
        <span className="inline-flex rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[12px] font-bold uppercase text-[#242424] shadow-sm">
          Upload &amp; Reuse
        </span>
        <h3 className="mx-auto mt-6 max-w-[760px] text-[34px] font-extrabold leading-[1.13] tracking-[-0.04em] text-black md:text-[52px]">
          Ready to show your genius?
        </h3>
        <p className="mx-auto mt-7 max-w-[585px] text-[22px] font-extrabold leading-[1.35] tracking-[-0.03em] text-black">
          Upload your FIGMA design &amp; join the creative community
        </p>
        <p className="mx-auto mt-[68px] max-w-[820px] text-[15px] font-medium leading-[1.55] text-[#666666]">
          Showcase your Figma designs, get inspired by others, and connect with fellow designers in the ultimate creative community.
        </p>
        <button className="mx-auto mt-10 flex h-[44px] items-center gap-4 rounded-full bg-black py-1.5 pl-6 pr-1.5 text-[12px] font-bold text-white">
          View Demo
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#9FE870] text-black">
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </section>
  );
}

function PricingFooter() {
  return (
    <footer className="mt-[105px] bg-[linear-gradient(180deg,#a9f17b_0%,#eaffdf_34%,#ffffff_72%)] px-5 pt-[118px]">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr_1.25fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image src={fcLogo} alt="figma components" className="h-[42px] w-auto object-contain" />
            </Link>
            <p className="mt-8 max-w-[300px] text-[14px] font-medium leading-[1.8] text-[#6b6b6b]">
              Clarity gives you the blocks &amp; components you need to create a truly professional website, landing page or admin panel for your SaaS.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#e5e5e5] bg-white text-black"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16">
            <div>
              <p className="mb-8 inline-flex rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-2 text-[13px] font-medium text-black">
                Company
              </p>
              <div className="flex flex-col gap-7 text-[14px] font-medium text-[#282828]">
                <Link href="/pricing">Pricing Plans</Link>
                <Link href="#">FAQ</Link>
                <Link href="#">Contact Us</Link>
              </div>
            </div>
            <div className="pt-[61px]">
              <div className="flex flex-col gap-7 text-[14px] font-medium text-[#282828]">
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Careers</Link>
                <Link href="#">Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-8 inline-flex rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-2 text-[13px] font-medium text-black">
              Monthly Newsletter
            </p>
            <h3 className="max-w-[410px] text-[18px] font-medium leading-[1.35] tracking-[-0.02em] text-[#222222]">
              Level Up Your Workflow and Boost Results With <span className="font-extrabold">figma components</span>
            </h3>
            <form className="mt-8 flex h-[48px] w-full max-w-[420px] rounded-[8px] border border-[#e5e5e5] bg-white p-1">
              <input
                className="min-w-0 flex-1 px-4 text-[14px] outline-none placeholder:text-[#b9b9b9]"
                placeholder="Email Address"
                type="email"
              />
              <button className="rounded-[6px] bg-black px-5 text-[13px] font-medium text-white">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[72px] border-t border-[#e6e6e6] py-6 text-center text-[15px] font-medium text-[#737373]">
          Copyright &amp; design by <span className="font-bold text-[#1c1c1c]">@figmacomponents.site</span> - 2026
        </div>
      </div>
    </footer>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-10 pt-[160px]">
        <div className="text-center">
          <h1 className="text-[42px] font-medium leading-[1.18] tracking-[-0.045em] text-[#161616] md:text-[54px]">
            Powerful features for
            <br />
            <span className="bg-[linear-gradient(90deg,#275ff1_8%,#64b9d7_52%,#7ac983_96%)] bg-clip-text text-transparent">
              Powerful Creators
            </span>
          </h1>
          <p className="mt-5 text-[16px] font-medium tracking-[-0.02em] text-[#222222]">
            Choose a plan that&apos;s right for you
          </p>
        </div>

        <div className="mx-auto mt-[72px] grid max-w-[960px] grid-cols-1 gap-10 md:grid-cols-3 md:items-start md:gap-[48px]">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <SpatialitySection />
      <PricingFooter />
    </main>
  );
}
