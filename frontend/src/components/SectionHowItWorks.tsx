import patternSvg from '../assets/pattern.svg';

const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Explore All Components, or All Inspiration",
    className: "bg-[#9FE870] text-[#111111]",
    badge: "bg-white text-[#111111]",
  },
  {
    number: "02",
    title: "Copy",
    description: "Copy from 100+ designs (50 more coming this summer)",
    className: "bg-black text-white",
    badge: "bg-[#9FE870] text-[#111111]",
  },
  {
    number: "03",
    title: "Paste",
    description: "Paste into your project. Works best on app versions",
    className: "bg-[#f4f5f7] text-[#111111]",
    badge: "bg-white text-[#111111]",
  },
];

function TradingMockup() {
  return (
    <div className="flex min-h-[360px] items-end justify-center overflow-hidden rounded-[10px] border border-[#d8d8d8] bg-[#f6fbfd] px-8 pt-10">
      <div className="mb-0 flex w-full max-w-[420px] flex-col items-center text-center">
        <h3 className="text-[24px] font-semibold text-[#111111]">Start trading with the app</h3>
        <p className="mt-2 max-w-[300px] text-[9px] leading-relaxed text-[#8c8c8c]">
          Unlock one user all new with multi-proved platforms and encrypted payments.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded bg-black px-4 py-1.5 text-[10px] font-semibold text-white">App Store</span>
          <span className="rounded bg-black px-4 py-1.5 text-[10px] font-semibold text-white">Google Play</span>
        </div>
        <div className="relative mt-10 h-[210px] w-[310px] overflow-hidden">
          <div className="absolute bottom-[-150px] left-1/2 h-[330px] w-[330px] -translate-x-1/2 rounded-full bg-[#2f73e8]" />
          <div className="absolute bottom-0 left-1/2 h-[240px] w-[128px] -translate-x-1/2 rounded-[28px] border-[7px] border-black bg-[#131721] p-4 text-left text-white shadow-2xl">
            <p className="text-[9px] text-[#9aa0aa]">Balance Dashboard</p>
            <p className="mt-4 text-[21px] font-semibold">$18,599.50</p>
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between text-[8px]">
                  <span className="h-5 w-5 rounded-full bg-[#243148]" />
                  <span>$2,402.56</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditCardMockup() {
  return (
    <div className="flex min-h-[330px] items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white p-10">
      <div className="relative w-full max-w-[480px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(159,232,112,0.3),_transparent_45%)]" />
        <h3 className="relative max-w-[220px] text-[24px] font-semibold leading-tight text-[#111111]">
          A special credit card made for Developers.
        </h3>
        <button className="relative mt-7 rounded-full bg-black px-5 py-2 text-[11px] font-semibold text-white">Get Free Card</button>
        <div className="absolute right-4 top-8 h-[116px] w-[210px] rotate-[-18deg] rounded-xl bg-[#f8f3df] shadow-xl" />
        <div className="absolute right-[-8px] top-[90px] h-[116px] w-[210px] rotate-[16deg] rounded-xl bg-[#111111] shadow-xl">
          <span className="absolute bottom-5 right-5 text-[20px] font-bold text-white">VISA</span>
        </div>
        <div className="relative mt-20 flex gap-8 text-[15px]">
          <span>2943 <small className="text-[#9a9a9a]">reviews</small></span>
          <span>$1M+ <small className="text-[#9a9a9a]">sales</small></span>
        </div>
      </div>
    </div>
  );
}

export function SectionHowItWorks() {
  return (
    <section className="w-full bg-white px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="relative overflow-visible pt-16 text-center">
          <img
            src={patternSvg}
            alt=""
            className="pointer-events-none absolute left-1/2 top-[-26px] z-0 w-[1300px] max-w-[calc(100vw-40px)] -translate-x-1/2 opacity-40"
          />
          <div className="mx-auto mb-7 flex w-fit items-center gap-0 relative z-10">
            <span className="h-14 w-14 rounded-full bg-[#dedede]" />
            <span className="-ml-3 h-14 w-14 rounded-full bg-[#dedede]" />
            <span className="-ml-3 grid h-14 w-14 place-items-center rounded-full bg-[#9FE870] text-[14px] font-semibold">20+</span>
            <span className="ml-5 text-left text-[15px] font-semibold uppercase leading-tight">Daily<br />Impressions</span>
          </div>

          <p className="mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#111] relative z-10">
            SIMPLE STEPS STEP'S TO BUILD
          </p>
          <h2 className="mt-6 font-outfit text-[clamp(2.4rem,3.6vw,4rem)] font-semibold leading-[1.12] tracking-normal text-[#111111] relative z-10">
            How it works
          </h2>
        </div>

        <div className="mx-auto mt-24 grid max-w-[980px] grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className={`flex min-h-[305px] flex-col items-center justify-center rounded-[10px] p-8 text-center ${step.className}`}>
              <span className={`rounded-full px-5 py-1.5 text-[13px] font-semibold uppercase ${step.badge}`}>Step - {step.number}</span>
              <div className="mt-10 h-11 w-11 rounded-full border border-current opacity-40" />
              <h3 className="mt-5 font-outfit text-[clamp(3rem,4vw,4.8rem)] font-medium leading-none tracking-normal">
                {step.title}
              </h3>
              <p className="mt-6 max-w-[220px] text-[16px] leading-snug opacity-80">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-28 border-t border-[#d9d9d9] pt-20">
          <div className="mb-20 flex flex-wrap items-center justify-center gap-10 text-[16px] font-medium">
            <span className="rounded-full bg-black px-7 py-4 text-white">Calendar</span>
            <span>Analytics</span>
            <span>Products</span>
            <span>Invoices</span>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <TradingMockup />
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
                Built with calendar
              </p>
              <h3 className="max-w-[620px] font-outfit text-[clamp(2rem,3vw,3.4rem)] font-medium leading-tight text-[#111111]">
                SaaS & app solutions offer a comprehensive
              </h3>
              <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
                Automation & workflow features include a drag & drop builder, automated task assignments, conditional with good triggers, and api integrations.
              </p>
              <p className="mt-10 max-w-[620px] border-l border-black pl-6 text-[18px] leading-[1.55] text-[#111111]">
                Collaboration tools enable in-app messaging, file sharing, task tracking, and video conferencing.
              </p>
            </div>
          </div>

          <div className="mt-28 grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[13px] font-semibold uppercase">
                Real-time analytics
              </p>
              <h3 className="max-w-[640px] font-outfit text-[clamp(2rem,3vw,3.4rem)] font-medium leading-tight text-[#111111]">
                Integration capabilities include RESTful APIs
              </h3>
              <p className="mt-8 max-w-[650px] text-[18px] leading-[1.65] text-[#6f6f6f]">
                Automation & workflow features include a drag & drop builder, automated task assignments, conditional with good triggers, and api integrations.
              </p>
              <p className="mt-10 max-w-[620px] border-l border-black pl-6 text-[18px] leading-[1.55] text-[#111111]">
                Mobile app features ensure cross-platform compatibility, push notifications, offline mode.
              </p>
            </div>
            <CreditCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
