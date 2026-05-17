"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import { paymentsApi } from "../api/payments";

import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { PricingModal } from "./PricingModal";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function UserAvatar({
  name,
  email,
  onLogout,
  onClick,
  isMobile = false,
}: {
  name: string;
  email: string;
  onLogout: () => void;
  onClick?: () => void;
  isMobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          if (isMobile && onClick) {
            onClick();
          } else {
            setOpen((v) => !v);
          }
        }}
        className={`
          flex items-center justify-center
          w-11 h-11
          rounded-full
          ${isMobile ? "bg-[#9FE870] text-black" : "bg-black/70 text-[#9FE870]"}
          backdrop-blur-xl
          text-[0.9rem]
          font-bold
          border border-white/10
          transition-all
          active:scale-95
        `}
      >
        {getInitials(name)}
      </button>

      {!isMobile && open && (
        <div
          className="
            absolute right-0 mt-3 w-56
            rounded-2xl
            border border-white/10
            bg-black/80
            backdrop-blur-2xl
            shadow-2xl
            overflow-hidden
            z-50
          "
        >
          <div className="px-4 py-4 border-b border-white/10">
            <p className="text-white text-sm font-semibold truncate">
              {name}
            </p>

            <p className="text-gray-400 text-xs truncate mt-1">
              {email}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/my-components"
              onClick={() => setOpen(false)}
              className="
                flex items-center
                px-3 py-3
                rounded-xl
                text-sm
                text-gray-300
                hover:bg-white/5
                hover:text-white
                transition-all
              "
            >
              My Components
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="
                w-full text-left
                flex items-center
                px-3 py-3
                rounded-xl
                text-sm
                text-red-400
                hover:bg-red-500/10
                transition-all
              "
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="transition-transform duration-300"
    >
      {open ? (
        <>
          <path
            d="M5 5l12 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 5L5 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M3 6h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M3 11h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M3 16h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const {
    user,
    logout,
    loading,
    setRegisterModalOpen,
    registerModalOpen,
    setLoginModalOpen,
    loginModalOpen,
    pricingModalOpen,
    setPricingModalOpen,
  } = useAuth();

  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription", "checkAccess"],
    queryFn: () => paymentsApi.checkAccess(),
    enabled: !!user,
    staleTime: 60000,
  });

  const isProUser = subscriptionData?.isProUser ?? false;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Component", href: "/components" },
    // { label: "Template", href: "#" },
    { label: "Pricing", href: "#" },
    // { label: "All Pages", href: "#" },
    { label: "Hire Us", href: "#" },
  ];

  const isComponentsPage = pathname === "/components";

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white border-b border-gray-50">
        <div
          className={`
            mx-auto flex h-15 items-center px-5
            ${isComponentsPage ? "max-w-full" : "max-w-[1344px]"}
          `}
        >

          {/* LEFT: LOGO */}
          <div className="lg:flex-1 flex items-center justify-start lg:min-w-[280px]">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 lg:gap-3 shrink-0"
            >
              <Image
                priority
                src="/logo2.png"
                alt="figma components"
                width={42}
                height={42}
                className="h-[36px] w-[36px] lg:h-[42px] lg:w-[42px] object-contain"
              />

              <span
                className="
            font-dm-sans
            text-[16px]
            lg:text-[18px]
            font-bold
            tracking-[-0.04em]
            text-[#111111]
            leading-none
          "
              >
                figma components
              </span>
            </Link>
          </div>

          {/* CENTER: NAVIGATION */}
          <nav className="hidden lg:flex items-center justify-center gap-10">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`
              relative
              font-dm-sans
              text-[16px]
              transition-all
              duration-200
              tracking-tight
              ${isActive
                      ? "text-[#54992e]"
                      : "text-black hover:text-[#54992e]"
                    }
            `}
                >
                  <span className="flex flex-col items-center justify-center">
                    <span className={isActive ? "font-semibold" : "font-medium"}>
                      {l.label}
                    </span>
                    {/* Hidden semibold span to reserve space and prevent layout shift */}
                    <span className="font-semibold invisible h-0 overflow-hidden" aria-hidden="true">
                      {l.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: CTA */}
          <div className="flex-1 flex items-center justify-end lg:min-w-[280px]">
            <div className="flex items-center gap-3">
              {!loading && !user ? (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="
              hidden sm:flex
              items-center
              justify-center
              h-[40px]
              px-6
              rounded-full
              bg-[#9FE870]
              font-dm-sans
              text-[14px]
              font-semibold
              text-black
              transition-all
              duration-200
              hover:bg-[#8edb5f]
              hover:shadow-md
              hover:shadow-[#9FE870]/10
              active:scale-[0.98]
              cursor-pointer
            "
                >
                  Sign In
                </button>
              ) : user ? (
                <div className="hidden lg:block">
                  <UserAvatar
                    name={user.name}
                    email={user.email}
                    onLogout={logout}
                  />
                </div>
              ) : null}

              {/* MOBILE BUTTON (Uses Profile Icon if logged in) */}
              <div className="lg:hidden flex items-center">
                {user ? (
                  <div className="relative">
                    {/* Show X icon if mobile menu is open, otherwise show avatar */}
                    {mobileOpen ? (
                      <button
                        type="button"
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#9FE870] text-black transition-all active:scale-95"
                        onClick={() => setMobileOpen(false)}
                      >
                        <HamburgerIcon open={true} />
                      </button>
                    ) : (
                      <UserAvatar
                        name={user.name}
                        email={user.email}
                        onLogout={logout}
                        isMobile={true}
                        onClick={() => setMobileOpen(true)}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="
                flex items-center justify-center
                w-10 h-10
                rounded-xl
                bg-[#9FE870]
                text-black
                transition-all
                hover:bg-[#8edb5f]
                active:scale-95
              "
                    onClick={() => setMobileOpen((v) => !v)}
                  >
                    <HamburgerIcon open={mobileOpen} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY MENU (Slide-down animation) */}
      <div
        className={`
    fixed inset-0 z-[90] lg:hidden
    bg-white/98 backdrop-blur-2xl
    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
  `}
      >
        <div className="flex flex-col items-center pt-[90px] pb-10 gap-4 px-6 overflow-y-auto h-full">
          {navLinks.map((l, i) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  transitionDelay: mobileOpen ? `${i * 70}ms` : "0ms",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateY(0)" : "translateY(-10px)"
                }}
                className={`
            font-dm-sans text-lg font-medium transition-all duration-500
            ${isActive ? "text-[#9FE870]" : "text-black"}
          `}
              >
                {l.label}
              </Link>
            );
          })}

          {user ? (
            <div
              className="flex flex-col items-center gap-6 mt-4 pt-8 border-t border-gray-100 w-full"
              style={{
                transitionDelay: mobileOpen ? `${navLinks.length * 70}ms` : "0ms",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(-10px)"
              }}
            >
              <div className="text-center">
                <p className="font-dm-sans text-[20px] font-medium text-black">{user.name}</p>
                <p className="font-dm-sans text-[12px] font-normal text-gray-500">{user.email}</p>
              </div>

              <div className="flex flex-col items-center gap-4 w-full px-6">
                <Link
                  href="/my-components"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-14 w-full rounded-2xl bg-black text-white font-dm-sans text-[14px] font-medium transition-all hover:bg-black/90 active:scale-95"
                >
                  My Components
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center h-14 w-full rounded-2xl border-2 border-red-500 text-red-500 font-dm-sans text-[14px] font-medium transition-all hover:bg-red-50 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            !loading && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setLoginModalOpen(true);
                }}
                className="
            mt-4
            flex items-center justify-center
            h-14 w-full max-w-[280px]
            rounded-2xl
            bg-[#9FE870]
            font-dm-sans text-[14px] font-medium
            text-black
            transition-all duration-500
            hover:bg-[#8edb5f]
            active:scale-95
            cursor-pointer
          "
                style={{
                  transitionDelay: mobileOpen ? `${navLinks.length * 70}ms` : "0ms",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateY(0)" : "translateY(-10px)"
                }}
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>

      {registerModalOpen && <RegisterModal />}

      {loginModalOpen && <LoginModal />}

      {pricingModalOpen && (
        <PricingModal
          isOpen={pricingModalOpen}
          onClose={() => setPricingModalOpen(false)}
        />
      )}
    </>
  );
}