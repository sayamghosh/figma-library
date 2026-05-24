import Link from "next/link";
import Image from "next/image";
import newLogo from "../app/assets/newLogo.png";

export function FooterSection() {
  return (
    <footer className="w-full bg-black px-5 py-10 font-dm-sans text-white sm:px-8 lg:py-11">
      <div className="mx-auto w-full max-w-[1386px]">
        <div className="grid gap-9 lg:grid-cols-[minmax(420px,1fr)_160px_160px_100px] lg:gap-10 xl:grid-cols-[705px_180px_180px_76px] xl:gap-[82px]">
          <section>
            <Image
              src={newLogo}
              alt="Figma Components"
              priority={false}
              className="h-9 w-auto object-contain"
            />
            <h2 className="mt-6 max-w-[350px] text-[26px] font-semibold leading-[1.14] text-white">
              Get Fresh Deals &amp; Travel Tips
              <br />
              in Your Inbox
            </h2>
            <form className="mt-5 flex max-w-[554px] flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-[51px] min-w-0 flex-1 rounded-full border-0 bg-[#292929] px-[26px] text-[16px] font-medium text-white outline-none placeholder:text-white/90"
              />
              <button
                type="button"
                className="h-[51px] rounded-full bg-white px-[28px] text-[16px] font-medium text-black"
              >
                Subscribe
              </button>
            </form>
          </section>

          <section className="lg:pt-1">
            <h3 className="text-[16px] font-semibold leading-none text-white">
              Figma Components
            </h3>
            <nav className="mt-6 flex flex-col gap-4">
              <Link href="/pricing" className="text-[16px] font-normal leading-none text-white/75">
                Pricing Plans
              </Link>
              <Link href="/faq" className="text-[16px] font-normal leading-none text-white/75">
                FAQ
              </Link>
              <Link href="#" className="text-[16px] font-normal leading-none text-white/75">
                Contact Us
              </Link>
            </nav>
          </section>

          <section className="lg:pt-1">
            <h3 className="text-[16px] font-semibold leading-none text-white">
              Explore
            </h3>
            <nav className="mt-6 flex flex-col gap-4">
              <Link href="/privacy-policy" className="text-[16px] font-normal leading-none text-white/75">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[16px] font-normal leading-none text-white/75">
                Careers
              </Link>
              <Link href="/terms-conditions" className="text-[16px] font-normal leading-none text-white/75">
                Terms &amp; Conditions
              </Link>
            </nav>
          </section>

          <section className="lg:pt-1">
            <h3 className="text-[16px] font-semibold leading-none text-white">
              Support
            </h3>
            <nav className="mt-6 flex flex-col gap-4">
              <Link href="#" className="text-[16px] font-normal leading-none text-white/75">
                Facebook
              </Link>
              <Link href="#" className="text-[16px] font-normal leading-none text-white/75">
                Instagram
              </Link>
              <Link href="#" className="text-[16px] font-normal leading-none text-white/75">
                YouTube
              </Link>
            </nav>
          </section>
        </div>

        <div className="mt-9 border-t border-white/15 pt-8">
          <h3 className="text-[16px] font-semibold leading-none text-white">
            Contact
          </h3>
          <div className="mt-6 flex flex-col gap-3 text-[16px] font-normal leading-none text-white/75 sm:flex-row sm:items-center">
            <p>Madhyamgram, Kolkata, India</p>
            <span className="hidden text-white/45 sm:inline">&bull;</span>
            <a href="mailto:support@figmacomponents.site">
              support@figmacomponents.site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
