import icon from "../assets/icon.svg"
import codeCard from "../assets/code-card.svg"

function ChartCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#999]">Primary text</p>
          <p className="mt-1 text-[28px] font-semibold leading-none text-[#111111]">5.987,37</p>
          <p className="mt-1 text-[11px] text-[#999]">Secondary text</p>
        </div>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e5e5e5] text-[11px] font-bold text-gray-500">i</span>
      </div>

      <div className="relative h-[140px] w-full text-[8px] text-[#9ca3af] font-medium">
        {/* Y-Axis */}
        <div className="absolute left-0 flex h-[120px] flex-col justify-between text-right">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
          <span>-20</span>
          <span>-40</span>
          <span>-60</span>
          <span>-80</span>
          <span>-100</span>
        </div>

        {/* Grid and Lines */}
        <div className="absolute left-7 right-0 h-[120px]">
          <svg className="h-full w-full" viewBox="0 0 240 120" preserveAspectRatio="none">
            {/* Grid lines */}
            <path d="M0 0H240 M0 24H240 M0 48H240 M0 72H240 M0 96H240 M0 120H240" stroke="#f3f4f6" strokeWidth="1" fill="none" />
            <path d="M0 0V120 M40 0V120 M80 0V120 M120 0V120 M160 0V120 M200 0V120 M240 0V120" stroke="#f3f4f6" strokeWidth="1" fill="none" />

            {/* Data lines */}
            <path d="M0 60 L40 40 L80 60 L120 20 L160 40 L200 10 L240 40" stroke="#1b75d0" strokeWidth="1.5" fill="none" />
            <circle cx="120" cy="20" r="2" fill="#1b75d0" />
            <path d="M0 80 L40 60 L80 90 L120 70 L160 85 L200 60 L240 80" stroke="#a855f7" strokeWidth="1.5" fill="none" />
            <circle cx="200" cy="60" r="2" fill="#a855f7" />
            <path d="M0 50 L40 70 L80 40 L120 60 L160 30 L200 50 L240 20" stroke="#ec4899" strokeWidth="1.5" fill="none" />
            <circle cx="80" cy="40" r="2" fill="#ec4899" />
          </svg>
        </div>

        {/* X-Axis */}
        <div className="absolute bottom-0 left-7 right-0 flex justify-between text-center">
          <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex justify-center gap-5 text-[9px] font-medium text-[#666]">
        <div className="flex items-center gap-2">
          <span className="h-[3px] w-3.5 rounded-full bg-[#1b75d0]"></span> Dataset 1
        </div>
        <div className="flex items-center gap-2">
          <span className="h-[3px] w-3.5 rounded-full bg-[#a855f7]"></span> Dataset 2
        </div>
        <div className="flex items-center gap-2">
          <span className="h-[3px] w-3.5 rounded-full bg-[#ec4899]"></span> Dataset 3
        </div>
      </div>
    </div>
  );
}

function ChecklistCard() {
  const items = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-5 rounded-[10px] border border-[#e7e7e7] bg-white p-7">
      {items.map((item) => {
        const col = item % 3;
        return (
          <label key={item} className="flex items-center gap-2 text-[13px] text-[#575757]">
            <span className={`grid h-4 w-4 place-items-center rounded border ${col === 0 ? "border-[#b7c2cf]" : "border-[#1b75d0] bg-[#1b75d0]"}`}>
              {col === 1 && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {col === 2 && (
                <span className="h-0.5 w-2 bg-white rounded-full" />
              )}
            </span>
            Label
          </label>
        );
      })}
      <p className="col-span-3 mt-3 text-[20px] font-medium leading-tight text-[#111111]">
        All in one kind of alerts from one place
      </p>
    </div>
  );
}

function CodeCard() {
  return (
    <div className="flex h-full flex-col justify-end rounded-[10px] border border-[#e7e7e7] bg-white p-8">
      <div className="relative mb-10 flex flex-1 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_center,_rgba(159,232,112,0.3),_rgba(168,85,247,0.08)_40%,_transparent_70%)] p-6">
        <img src={codeCard} alt="" className="w-[329px] h-[363px] object-contain" />
      </div>
      <h3 className="text-[22px] font-semibold text-[#111111] tracking-tight">Including both free and premium options</h3>
      <p className="mt-3 text-[15px] leading-[1.6] text-[#6f6f6f]">
        Premium design seamlessly merges superior materials, intuitive functionality, and elegant aesthetics. It prioritizes meticulous attention to detail and user experience to maximize the product's value.
      </p>
    </div>
  );
}


function UiControlsCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-7">
      <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-[#e5e7eb] text-center text-[13px] font-medium text-[#444]">
        <span className="border-r border-[#e5e7eb] py-2.5">Text</span>
        <span className="border-r border-[#e5e7eb] py-2.5">Text</span>
        <span className="py-2.5">Text</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg border border-[#e5e7eb] px-4 py-3 text-[13px] text-[#444]">
        {["Text", "Text", "Text"].map((text, index) => (
          <span key={`${text}-${index}`} className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border border-[#999]" />
            {text}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-grid grid-cols-3 overflow-hidden rounded-lg border border-[#e5e7eb] text-[16px] text-[#444]">
        <span className="border-r border-[#e5e7eb] px-4 py-2 hover:bg-gray-50 flex justify-center items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </span>
        <span className="border-r border-[#e5e7eb] px-4 py-2 hover:bg-gray-50 flex justify-center items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        <span className="px-4 py-2 hover:bg-gray-50 flex justify-center items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
      <p className="mt-8 text-[18px] font-medium leading-snug text-[#111111]">
        Secure authentication with multi factor verification
      </p>
    </div>
  );
}

function TagsCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-7">
      <div className="mb-6 flex flex-wrap gap-2.5">
        {["BUTTON", "NAV BAR", "MENU BAR", "FOOTER", "CTA"].map((tag) => (
          <span key={tag} className="rounded-md border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-semibold text-[#333] tracking-wide">
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-[#e5e7eb] py-4">
        <div className="flex items-center justify-center">
          <img src={icon} alt="icon" className="w-10 h-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold leading-[1.1] text-[#111111] tracking-tight">figma</span>
          <span className="text-[18px] font-semibold leading-[1.1] text-[#111111] tracking-tight mt-[1px]">Components</span>
        </div>
      </div>
      <p className="text-[18px] font-medium leading-snug text-[#111111]">
        Auto spin up incident Slack channels, Zoom, Jira tickets
      </p>
    </div>
  );
}

export function OperationsSection() {
  return (
    <section className="w-full bg-[#f8fafc] px-5 pt-20 sm:px-8 lg:pt-28 pb-8">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mx-auto inline-flex rounded-full border border-[#e0e0e0] bg-white px-6 py-2 text-[14px] font-semibold uppercase tracking-widest text-[#111]">
            BUILD YOUR PIXEL-PERFECT APP
          </p>
          <h2 className="mt-6 font-outfit text-[clamp(2.4rem,3.6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-[#111111]">
            Browse thousands of reusable website components
          </h2>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-[0.72fr_1.58fr_0.72fr] relative z-10">
          <div className="grid gap-5">
            <ChartCard />
            <ChecklistCard />
          </div>
          <CodeCard />
          <div className="grid gap-5">
            <UiControlsCard />
            <TagsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
