function ChartCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase text-[#6b7280]">Primary text</p>
          <p className="mt-1 text-[28px] font-semibold leading-none text-[#111111]">5,987,37</p>
          <p className="mt-1 text-[10px] text-[#9ca3af]">Saturday, test</p>
        </div>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#d4d4d4] text-[11px] text-white">i</span>
      </div>
      <svg className="h-[130px] w-full" viewBox="0 0 260 130" fill="none" aria-hidden="true">
        <path d="M0 106H260M0 78H260M0 50H260M0 22H260" stroke="#e9e9e9" />
        <path d="M8 92L44 98L78 71L118 88L148 42L190 82L228 58L252 90" stroke="#1f77b4" strokeWidth="3" fill="none" />
        <path d="M8 102L44 88L78 97L118 78L148 84L190 62L228 92L252 73" stroke="#a855f7" strokeWidth="3" fill="none" />
        <path d="M8 74L44 91L78 79L118 101L148 74L190 86L228 65L252 48" stroke="#ec4899" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}

function ChecklistCard() {
  const items = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-5 rounded-[10px] border border-[#e7e7e7] bg-white p-7">
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2 text-[13px] text-[#575757]">
          <span className={`grid h-4 w-4 place-items-center rounded border ${item % 3 === 1 ? "border-[#1b75d0] bg-[#1b75d0]" : "border-[#b7c2cf]"}`}>
            {item % 3 === 1 && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
          </span>
          Label
        </label>
      ))}
      <p className="col-span-3 mt-2 max-w-[230px] text-[20px] font-medium leading-tight text-[#111111]">
        All in one kind of alerts from one place
      </p>
    </div>
  );
}

function CodeCard() {
  return (
    <div className="flex h-full flex-col justify-end rounded-[10px] border border-[#dedede] bg-white p-7">
      <div className="relative mx-auto mb-12 flex min-h-[290px] w-full max-w-[380px] items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_center,_rgba(159,232,112,0.35),_rgba(168,85,247,0.1)_42%,_transparent_70%)]">
        <div className="absolute top-2 left-6 rounded-lg bg-white/95 px-5 py-4 font-mono text-[10px] leading-5 text-[#999] shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10">
          <div className="flex gap-1.5 mb-2">
             <div className="w-2 h-2 rounded-full bg-[#f87171]" />
             <div className="w-2 h-2 rounded-full bg-[#facc15]" />
             <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
          </div>
          <p className="text-[#c46b75]">&lt;ul&gt;</p>
          <p className="pl-4 text-[#c46b75]">&lt;li&gt;<span className="text-[#333]">Classic Movies</span>&lt;/li&gt;</p>
          <p className="pl-4 text-[#c46b75]">&lt;ul&gt;</p>
          <p className="pl-8 text-[#c46b75]">&lt;li className=<span className="text-[#3b82f6]">"hover:underline"</span>&gt;</p>
          <p className="pl-12 text-[#c46b75]">&lt;a&gt;<span className="text-[#333]">Movie Title</span>&lt;/a&gt;</p>
          <p className="pl-8 text-[#c46b75]">&lt;/li&gt;</p>
          <p className="pl-8 text-[#c46b75]">&lt;li&gt;<span className="text-[#333]">Genre</span>&lt;/li&gt;</p>
          <p className="pl-8 text-[#c46b75]">&lt;li&gt;<span className="text-[#333]">Year</span>&lt;/li&gt;</p>
          <p className="pl-4 text-[#c46b75]">&lt;/ul&gt;</p>
          <p className="text-[#c46b75]">&lt;/ul&gt;</p>
        </div>
        <svg className="absolute right-[40px] top-[75px] w-10 h-[70px] z-20" viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 C 25 -5, 45 20, 20 35 C -5 50, 15 65, 30 65" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M22 68 L 30 65 L 28 56" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <div className="absolute bottom-2 right-4 rounded-lg bg-[#111111] px-5 py-4 text-[9px] leading-4 text-white shadow-2xl min-w-[200px] z-30">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-gray-700 pb-2 mb-2 text-gray-400 font-semibold uppercase text-[8px]">
            <span>Movie Title</span>
            <span>Genre</span>
            <span>Year</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2">
            <span>Star Wars</span><span className="text-gray-400">Adventure</span><span className="text-gray-400">1977</span>
            <span>Howard The Duck</span><span className="text-gray-400">Comedy</span><span className="text-gray-400">1986</span>
            <span>American Graffiti</span><span className="text-gray-400">Comedy</span><span className="text-gray-400">1973</span>
            <span>Spaceballs</span><span className="text-gray-400">Sci-Fi</span><span className="text-gray-400">1987</span>
            <span>Psycho</span><span className="text-gray-400">Thriller</span><span className="text-gray-400">1960</span>
            <span>The Godfather</span><span className="text-gray-400">Crime</span><span className="text-gray-400">1972</span>
          </div>
        </div>
      </div>
      <h3 className="text-[25px] font-semibold text-[#111111]">Including both free and premium options</h3>
      <p className="mt-4 max-w-[620px] text-[16px] leading-[1.65] text-[#6f6f6f]">
        Premium design seamlessly merges superior materials, intuitive functionality, and elegant aesthetics. It prioritizes meticulous attention to detail and user experience to maximize the product's value.
      </p>
    </div>
  );
}

function UiControlsCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-5">
      <div className="grid grid-cols-3 overflow-hidden rounded-md border border-[#d8d8d8] text-center text-[14px]">
        <span className="border-r border-[#d8d8d8] py-3">Text</span>
        <span className="border-r border-[#d8d8d8] py-3">Text</span>
        <span className="py-3">Text</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-md border border-[#d8d8d8] px-4 py-3 text-[14px]">
        {["Text", "Text", "Text"].map((text, index) => (
          <span key={`${text}-${index}`} className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border border-[#222]" />
            {text}
          </span>
        ))}
      </div>
      <div className="mt-4 inline-grid grid-cols-3 overflow-hidden rounded-md border border-[#d8d8d8] text-[18px]">
        <span className="border-r border-[#d8d8d8] px-4 py-2">←</span>
        <span className="border-r border-[#d8d8d8] px-4 py-2">+</span>
        <span className="px-4 py-2">→</span>
      </div>
      <p className="mt-9 text-[20px] font-medium leading-tight text-[#111111]">
        Secure authentication with multi factor verification
      </p>
    </div>
  );
}

function TagsCard() {
  return (
    <div className="rounded-[10px] border border-[#e7e7e7] bg-white p-7">
      <div className="mb-7 flex flex-wrap gap-3">
        {["BUTTON", "NAV BAR", "MENU BAR", "FOOTER", "CTA"].map((tag) => (
          <span key={tag} className="rounded border border-[#dddddd] px-3 py-2 text-[15px] font-semibold">
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-7 flex min-h-[78px] items-center justify-center rounded border border-[#eeeeee]">
        <span className="text-[23px] font-semibold leading-none text-[#111111]">
          <span className="text-[#9fe870]">figma</span>
          <br />
          components
        </span>
      </div>
      <p className="text-[20px] font-medium leading-tight text-[#111111]">
        Auto spin up incident Slack channels, Zoom, Jira tickets
      </p>
    </div>
  );
}

export function OperationsSection() {
  return (
    <section className="w-full bg-white px-5 pt-20 sm:px-8 lg:pt-28 pb-8">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto mb-8 h-12 w-full max-w-[300px] border-t border-[#9fe870] relative">
            <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#9fe870] -translate-x-1/2" />
          </div>
          <p className="mx-auto inline-flex rounded-full border border-[#d7d7d7] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#111]">
            BUILD YOUR PIXEL-PERFECT APP
          </p>
          <h2 className="mt-7 font-outfit text-[clamp(2.4rem,3.6vw,4rem)] font-semibold leading-[1.12] tracking-normal text-[#111111]">
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
