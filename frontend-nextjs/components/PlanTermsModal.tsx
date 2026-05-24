"use client";

import { X } from "lucide-react";

interface PlanTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanTermsModal({ isOpen, onClose }: PlanTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white p-6 text-[#111111] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close plan terms"
        >
          <X size={18} />
        </button>

        <div className="pr-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
            Plan Terms
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Purchase terms and conditions
          </h2>
        </div>

        <ul className="mt-6 space-y-4 text-sm leading-6 text-[#475569]">
          <li>
            If you purchase a new plan during your current plan validity, your
            unused component credits from the old plan will be carried forward.
          </li>
          <li>
            Remaining validity days from the old plan will not be carried
            forward.
          </li>
          <li>
            After purchase, your active validity will simply become the validity
            period of the newly purchased plan, counted from the new purchase
            date.
          </li>
        </ul>
      </div>
    </div>
  );
}
