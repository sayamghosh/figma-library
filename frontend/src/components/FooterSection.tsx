import { Link } from "@tanstack/react-router";
import logoImg from "../assets/logo.svg";

const companyLinks = ["About Us", "Our Team", "Pricing Plans", "Faq", "Contact Us", "Refund Policy"];
const policyLinks = ["404", "Features", "Privacy Policy", "Careers", "Terms & Conditions"];

export function FooterSection() {
  return (
    <footer className="w-full bg-[linear-gradient(180deg,#9FE870_0%,#f3ffe8_28%,#ffffff_72%)] px-5 pt-24 font-manrope sm:px-8 lg:pt-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1.3fr_1.15fr]">
          <div>
            <img src={logoImg} alt="figma components" className="h-12 w-auto object-contain" />
            <p className="mt-9 max-w-[340px] text-[18px] leading-[1.55] text-[#565656]">
              Products & services are important. They might sell dairy, meat, maybe even eco-friendly manure compost. Including a CSA program...
            </p>
            <div className="mt-10 flex gap-4">
              {["f", "x", "in", "yt"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`grid h-12 w-12 place-items-center rounded-full border border-[#dcdcdc] text-[14px] font-semibold ${item === "x" ? "bg-black text-[#9FE870]" : "bg-white text-black"}`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-8 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
              Company
            </p>
            <div className="grid grid-cols-2 gap-x-16 gap-y-5">
              {companyLinks.map((link) => (
                <Link key={link} to="/" className="text-[16px] text-[#4d4d4d] transition-colors hover:text-black">
                  {link}
                </Link>
              ))}
              {policyLinks.map((link) => (
                <Link key={link} to="/" className="text-[16px] text-[#4d4d4d] transition-colors hover:text-black">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-8 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
              Weekly newsletter
            </p>
            <p className="max-w-[360px] text-[18px] leading-[1.55] text-[#565656]">
              Get every single updates from our weekly newsletter.
            </p>
            <form className="mt-8">
              <div className="flex min-h-[66px] items-center rounded-full border border-[#d8d8d8] bg-white px-6">
                <input
                  type="email"
                  placeholder="Business email"
                  className="min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-[#b9b9b9]"
                />
                <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">✉</span>
              </div>
              <button type="button" className="mt-5 inline-flex h-[58px] items-center gap-5 rounded-full bg-black py-2 pl-8 pr-2 text-[15px] font-semibold text-white">
                Subscribe
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#9FE870] text-black">→</span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 border-t border-[#d1d1d1] py-8 text-center text-[16px] text-[#575757]">
          Copyright & design by <span className="font-semibold text-black">@figmacomponents.site</span> - 2026
        </div>
      </div>
    </footer>
  );
}
