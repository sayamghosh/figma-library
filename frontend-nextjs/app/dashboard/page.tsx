"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { paymentsApi } from "../../api/payments";
import { 
  ArrowUpRight, 
  Zap, 
  Copy, 
  Clock, 
  ShieldCheck, 
  Loader2, 
  LayoutDashboard, 
  Heart, 
  CreditCard, 
  Mail, 
  ChevronDown 
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading, setLoginModalOpen } = useAuth();
  
  // Sidebar state (active tab)
  const [activeTab, setActiveTab] = useState("Overview");

  // Fetch current subscription details
  const { data: subscriptionResponse, isLoading: subLoading } = useQuery({
    queryKey: ["subscription", "current"],
    queryFn: () => paymentsApi.getCurrentSubscription(),
    enabled: !!user,
  });

  // Get active subscription info
  const subscription = subscriptionResponse || null;
  const isPro = !!subscription && subscription.status === "active";

  // Calculations for Components Copied
  const componentCountUsed = subscription?.componentCountUsed ?? 0;
  const maxComponents = subscription?.maxComponents ?? 0;

  // Calculations for Days Left
  let daysLeft = 0;
  let durationDays = 0;

  if (subscription && subscription.endDate) {
    const end = new Date(subscription.endDate).getTime();
    const now = Date.now();
    const diffTime = end - now;
    daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    durationDays = subscription.plan?.durationDays ?? 30;
  }

  // Loading States
  if (authLoading || subLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#238B45]" />
        <p className="text-gray-500 font-medium text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="max-w-[1300px] mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-16 h-16 bg-[#238B45]/10 rounded-full flex items-center justify-center text-[#238B45]">
          <ShieldCheck size={32} />
        </div>
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Please log in to view your dashboard, manage subscription limits, copy counts, and plan details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLoginModalOpen(true)}
          className="bg-[#238B45] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#2a9d50] transition-all shadow-md shadow-[#238B45]/10 hover:shadow-[#238B45]/20 active:scale-95 cursor-pointer"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  // Sidebar Menu Config
  const sidebarLinks = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Favorites", icon: Heart },
    { label: "Billing & Invoice", icon: CreditCard, href: "/pricing" },
    { label: "Contact Us", icon: Mail }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1E293B]">
      <div className="max-w-[1344px] mx-auto flex flex-col lg:flex-row px-5">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-[310px] py-4 lg:py-6 px-4 lg:pl-0 lg:pr-6 shrink-0 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] flex flex-col">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-5 h-full flex flex-col overflow-hidden">
            
            {/* User Profile Info */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#238B45] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-[#1E293B] truncate leading-tight">{user.name}</h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Team Dropdown */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#1E293B] hover:bg-slate-100/80 transition cursor-pointer select-none">
                <span>{user.name.split(" ")[0]}&apos;s Team</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.label;
                
                const content = (
                  <span className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? "text-[#238B45]" : "text-gray-400"} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                );

                const className = `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[#238B45]/10 text-[#238B45]" 
                    : "text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B]"
                }`;

                if (item.href) {
                  return (
                    <Link key={item.label} href={item.href} className={className}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveTab(item.label)}
                    className={className}
                  >
                    {content}
                  </button>
                );
              })}
            </nav>

          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <section className="flex-1 py-6 md:py-8 lg:py-10 px-4 md:px-8 lg:pl-10 lg:pr-0 max-w-full">
          
          {/* Top row cards (Figma Design Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Plan Info Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Plan</h3>
                  <h2 className="text-xl font-extrabold text-[#1E293B] mt-1.5">
                    {isPro ? (subscription.plan?.displayName || "Pro Plan") : "Free Plan"}
                  </h2>
                </div>
                
                {/* Upgrade Button */}
                <Link 
                  href="/pricing"
                  className="flex items-center gap-1 text-xs font-bold text-[#238B45] hover:text-[#2a9d50] hover:underline transition duration-200"
                >
                  Upgrade Plan
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="text-xs font-semibold text-gray-400 mt-6 pt-4 border-t border-slate-50">
                {isPro ? (
                  <span className="flex items-center gap-1.5 text-[#238B45]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#238B45] animate-pulse" />
                    Active subscription expires {new Date(subscription.endDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span>No active subscription</span>
                )}
              </div>
            </div>

            {/* Team Details Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{user.name.split(" ")[0]}&apos;s Team</h3>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">
                  {isPro ? "Pro" : "Free"}
                </span>
              </div>

              {/* Grid metrics details */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Seats</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">1 out of 1</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Components</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">{isPro ? `${maxComponents}/mo` : "0/mo"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Templates</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">0/mo</span>
                </div>
              </div>
            </div>

          </div>

          {/* Tab Selection Area & Reset indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-8">
            <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit">
              <button className="px-3 py-1.5 text-xs font-bold text-[#238B45] bg-[#238B45]/10 rounded-lg">
                Current Period
              </button>
              <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-slate-700 rounded-lg transition duration-200">
                Lifetime Total
              </button>
            </div>
            
            {isPro && subscription.endDate && (
              <span className="text-xs text-gray-400 font-semibold italic">
                * Limits reset on {new Date(subscription.endDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Usage Metrics block (4 Grid boxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            {/* Box 1: Components Copied */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Components Copied</span>
                <span className="text-3xl font-extrabold text-[#1E293B] mt-2 block">
                  {String(componentCountUsed).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400 mt-4 block">
                out of {isPro ? maxComponents : "0"}
              </span>
            </div>

            {/* Box 2: Templates Unlocked */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Templates Unlocked</span>
                <span className="text-3xl font-extrabold text-[#1E293B] mt-2 block">00</span>
              </div>
              <span className="text-xs font-semibold text-gray-400 mt-4 block">
                out of 0
              </span>
            </div>

            {/* Box 3: Templates Downloaded */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Days Remaining</span>
                <span className="text-3xl font-extrabold text-[#1E293B] mt-2 block">
                  {String(daysLeft).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400 mt-4 block">
                out of {isPro ? durationDays : "0"} total days
              </span>
            </div>

            {/* Box 4: Library Access */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Library Access</span>
                <span className="text-3xl font-extrabold text-[#1E293B] mt-2 block">
                  {isPro ? "01" : "00"}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400 mt-4 block">
                active libraries
              </span>
            </div>

          </div>

          {/* Chart Mock Box */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 mb-16 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl w-fit">
                {["7 d", "30 d", "90 d", "Month"].map((d) => (
                  <button 
                    key={d}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition duration-200 ${
                      d === "30 d" ? "bg-[#238B45]/10 text-[#238B45]" : "text-gray-400 hover:text-slate-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400">Last 30 days</span>
            </div>

            {/* SVG line chart mimic */}
            <div className="h-48 w-full relative flex flex-col justify-between">
              
              {/* grid lines */}
              <div className="w-full border-b border-slate-100 flex justify-between text-[10px] text-gray-300 font-bold pb-1"><span>4</span></div>
              <div className="w-full border-b border-slate-100 flex justify-between text-[10px] text-gray-300 font-bold pb-1"><span>3</span></div>
              <div className="w-full border-b border-slate-100 flex justify-between text-[10px] text-gray-300 font-bold pb-1"><span>2</span></div>
              <div className="w-full border-b border-slate-100 flex justify-between text-[10px] text-gray-300 font-bold pb-1"><span>1</span></div>
              
              {/* Green dot line at baseline (zeros) */}
              <div className="absolute inset-x-0 bottom-6 h-0.5 bg-[#238B45]">
                <div className="absolute left-[5%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[20%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[35%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[50%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[65%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[80%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
                <div className="absolute left-[95%] bottom-[-3px] w-2.5 h-2.5 rounded-full bg-[#238B45] border-2 border-white" />
              </div>

              {/* dates label row */}
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 pt-1 border-t border-slate-150">
                <span>0</span>
                <span>Apr 24</span>
                <span>Apr 27</span>
                <span>Apr 30</span>
                <span>May 3</span>
                <span>May 6</span>
                <span>May 9</span>
                <span>May 12</span>
                <span>May 15</span>
                <span>May 18</span>
                <span>May 21</span>
              </div>

            </div>
          </div>

        </section>

      </div>
    </main>
  );
}
