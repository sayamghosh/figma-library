"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clipboard,
  Crown,
  Image as ImageIcon,
  Layers3,
  Loader2,
  MonitorSmartphone,
  UploadCloud,
  X,
} from "lucide-react";
import { extractFigmaBase64FromPaste } from "../lib/clipboard";

type DesignType = "Wireframe" | "UI Design";
type PricingType = "Free" | "Pro";
type PlatformTag = "app" | "web";

export interface ComponentEditorValues {
  name: string;
  description: string;
  tags: string[];
  figmaDataBase64: string;
  previewFile: File | null;
  designType: DesignType;
  pricingType: PricingType;
  platformTag: PlatformTag;
}

interface ComponentEditorModalProps {
  mode: "create" | "edit";
  initialValues?: Partial<ComponentEditorValues>;
  currentPreviewImageUrl?: string;
  isSubmitting: boolean;
  status: string;
  allowPro: boolean;
  onClose: () => void;
  onSubmit: (values: ComponentEditorValues) => Promise<void>;
}

const defaultValues: ComponentEditorValues = {
  name: "",
  description: "",
  tags: [],
  figmaDataBase64: "",
  previewFile: null,
  designType: "UI Design",
  pricingType: "Free",
  platformTag: "web",
};

const samplePayload = `<!-- figma-component -->
[NODE_READY: 0x7A21]
[PAYLOAD_STATUS: verified]
[STREAM: base64-encoded]
010110101100101001110010`;

function mergeInitialValues(initialValues?: Partial<ComponentEditorValues>) {
  return {
    ...defaultValues,
    ...initialValues,
    tags: initialValues?.tags ?? [],
    previewFile: null,
  };
}

function getStatusTone(status: string) {
  if (!status) return "";
  if (/success|captured|submitted/i.test(status)) {
    return "border-[#238B45]/20 bg-[#238B45]/10 text-[#176534]";
  }
  if (/uploading|updating|saving/i.test(status)) {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }
  if (/paste|select|required/i.test(status)) {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }
  return "border-red-100 bg-red-50 text-red-600";
}

export function ComponentEditorModal({
  mode,
  initialValues,
  currentPreviewImageUrl,
  isSubmitting,
  status,
  allowPro,
  onClose,
  onSubmit,
}: ComponentEditorModalProps) {
  const seed = useMemo(() => mergeInitialValues(initialValues), [initialValues]);
  const [name, setName] = useState(seed.name);
  const [description, setDescription] = useState(seed.description);
  const [tags, setTags] = useState<string[]>(seed.tags);
  const [tagInputValue, setTagInputValue] = useState("");
  const [figmaDataBase64, setFigmaDataBase64] = useState(seed.figmaDataBase64);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [designType, setDesignType] = useState<DesignType>(seed.designType);
  const [pricingType, setPricingType] = useState<PricingType>(seed.pricingType);
  const [platformTag, setPlatformTag] = useState<PlatformTag>(seed.platformTag);
  const [localStatus, setLocalStatus] = useState("");

  const previewUrl = useMemo(() => {
    if (previewFile) return URL.createObjectURL(previewFile);
    return currentPreviewImageUrl || "";
  }, [currentPreviewImageUrl, previewFile]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewFile) URL.revokeObjectURL(previewUrl);
    };
  }, [previewFile, previewUrl]);

  useEffect(() => {
    const handleGlobalPaste = async (event: ClipboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        (target.tagName === "INPUT" &&
          !["file", "checkbox", "radio"].includes((target as HTMLInputElement).type)) ||
        target.tagName === "TEXTAREA"
      ) {
        if (target.id !== "figmaPaste") return;
      }

      try {
        const value = await extractFigmaBase64FromPaste(event);
        if (value) {
          setFigmaDataBase64(value);
          setLocalStatus("Captured Figma payload successfully.");
        }
      } catch (error) {
        if (target.id === "figmaPaste") {
          setLocalStatus(error instanceof Error ? error.message : "Could not extract payload.");
        }
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, []);

  const visibleStatus = status || localStatus;
  const title = mode === "create" ? "Add New Component" : "Update Component";
  const subtitle =
    mode === "create"
      ? "Package the preview, metadata, and Figma payload in one clean submission."
      : "Refresh the component details while keeping the existing assets intact.";

  function handleTagInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (!value.includes(",")) {
      setTagInputValue(value);
      return;
    }

    const newTags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setTags((current) => [...current, ...newTags]);
    setTagInputValue("");
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const nextTag = tagInputValue.trim();
      if (nextTag) {
        setTags((current) => [...current, nextTag]);
        setTagInputValue("");
      }
      return;
    }

    if (event.key === "Backspace" && !tagInputValue && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  }

  function removeTag(indexToRemove: number) {
    setTags((current) => current.filter((_, index) => index !== indexToRemove));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTags = Array.from(
      new Set(
        [...tags, ...tagInputValue.split(",").map((tag) => tag.trim()), platformTag]
          .filter(Boolean)
          .filter((tag) => !["web", "app"].includes(tag.toLowerCase()) || tag === platformTag)
      )
    );

    await onSubmit({
      name,
      description,
      tags: cleanTags,
      figmaDataBase64,
      previewFile,
      designType,
      pricingType,
      platformTag,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/45 p-4 text-slate-950 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
        <section className="relative w-full max-w-[820px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#238B45,#9FE870,#2563EB)]" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Close editor"
          >
            <X size={18} />
          </button>

          <div className="border-b border-slate-100 px-5 py-4 pr-16 sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#238B45]">
              Component Studio
            </p>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">{title}</h1>
            <p className="mt-1 max-w-2xl text-xs font-medium text-slate-500">{subtitle}</p>
          </div>

            <form onSubmit={handleSubmit} className="max-h-[76vh] overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Component Name
                    </label>
                    <input
                      type="text"
                      placeholder="Hero Section, Dashboard Header..."
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-[#238B45] focus:bg-white focus:ring-4 focus:ring-[#238B45]/10"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Description
                    </label>
                    <textarea
                      placeholder="Short notes about layout, use case, variants, or style."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={2}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium leading-5 text-slate-950 outline-none transition focus:border-[#238B45] focus:bg-white focus:ring-4 focus:ring-[#238B45]/10"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                      Tags
                    </label>
                    <div
                      className="flex min-h-10 cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 transition focus-within:border-[#238B45] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#238B45]/10"
                      onClick={(event) => (event.currentTarget.lastElementChild as HTMLElement)?.focus()}
                    >
                      {tags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#238B45]/10 px-2.5 py-0.5 text-xs font-bold text-[#176534]"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="grid h-4 w-4 place-items-center rounded-full hover:bg-[#238B45]/10"
                            aria-label={`Remove ${tag}`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={tags.length === 0 ? "hero, SaaS, landing" : ""}
                        value={tagInputValue}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Design
                      </label>
                    <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        {(["UI Design", "Wireframe"] as DesignType[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDesignType(option)}
                            className={`rounded-lg px-2 py-1.5 text-xs font-extrabold transition ${
                              designType === option ? "bg-white text-[#238B45] shadow-sm" : "text-slate-500"
                            }`}
                          >
                            {option === "UI Design" ? "UI" : "Wire"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Access
                      </label>
                      <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        {(["Free", "Pro"] as PricingType[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => allowPro || option === "Free" ? setPricingType(option) : undefined}
                            disabled={!allowPro && option === "Pro"}
                            className={`rounded-lg px-2 py-1.5 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              pricingType === option ? "bg-white text-[#238B45] shadow-sm" : "text-slate-500"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                        Platform
                      </label>
                      <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        {(["web", "app"] as PlatformTag[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setPlatformTag(option)}
                            className={`rounded-lg px-2 py-1.5 text-xs font-extrabold capitalize transition ${
                              platformTag === option ? "bg-white text-[#238B45] shadow-sm" : "text-slate-500"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-[#238B45] shadow-sm">
                        <UploadCloud size={17} />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Preview image</p>
                        <p className="text-xs font-semibold text-slate-500">
                          {mode === "edit" ? "Upload only if you want to replace the current preview." : "Required for new components."}
                        </p>
                      </div>
                    </div>
                    <label className="group flex min-h-[88px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-center transition hover:border-[#238B45] hover:bg-[#f8fcf6]">
                      {previewUrl ? (
                        <span className="relative block h-[70px] w-full overflow-hidden rounded-lg">
                          <Image
                            src={previewUrl}
                            alt="Component preview"
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </span>
                      ) : (
                        <>
                          <ImageIcon className="mb-2 text-slate-400 transition group-hover:text-[#238B45]" size={22} />
                          <span className="text-sm font-bold text-slate-700">Drop or choose an image</span>
                          <span className="text-xs font-medium text-slate-400">PNG, JPG, or WebP</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setPreviewFile(event.target.files?.[0] || null)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#9FE870] text-[#0f1d16]">
                          <Clipboard size={17} />
                        </span>
                        <div>
                          <p className="text-xs font-extrabold">Figma payload</p>
                          <p className="text-xs font-semibold text-white/50">Paste copied component data</p>
                        </div>
                      </div>
                      {figmaDataBase64 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9FE870]/15 px-3 py-1 text-xs font-extrabold text-[#9FE870]">
                          <CheckCircle2 size={14} />
                          Captured
                        </span>
                      )}
                    </div>

                    <div className="relative min-h-[176px] overflow-hidden rounded-xl border border-white/10 bg-black/35">
                      {figmaDataBase64 ? (
                        <div className="h-full p-4">
                          <pre className="max-h-[130px] overflow-hidden whitespace-pre-wrap break-all font-mono text-[10px] leading-5 text-[#9FE870]/70">
                            {samplePayload}
                          </pre>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 pt-16">
                            <button
                              type="button"
                              onClick={() => setFigmaDataBase64("")}
                              className="h-10 w-full rounded-xl bg-white/10 text-xs font-extrabold text-white transition hover:bg-white/15"
                            >
                              Replace Payload
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex min-h-[176px] flex-col items-center justify-center p-5 text-center">
                          <MonitorSmartphone className="mb-3 text-white/35" size={30} />
                          <p className="text-sm font-extrabold">Click here, then press Ctrl + V</p>
                          <p className="mt-2 max-w-[250px] text-xs font-medium leading-5 text-white/45">
                            Copy a component from Figma and paste it into this capture area.
                          </p>
                          <textarea
                            id="figmaPaste"
                            value=""
                            onChange={() => {}}
                            className="absolute inset-0 h-full w-full cursor-pointer resize-none opacity-0"
                            aria-label="Paste Figma component payload"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-3 text-sm font-extrabold text-slate-800">
                      <Layers3 size={18} className="text-[#238B45]" />
                      Submission Summary
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-500">
                      <span className="rounded-xl bg-slate-50 p-2.5">
                        <span className="mb-1 block text-slate-400">Design</span>
                        {designType}
                      </span>
                      <span className="rounded-xl bg-slate-50 p-2.5">
                        <span className="mb-1 block text-slate-400">Access</span>
                        <span className="inline-flex items-center gap-1">
                          {pricingType === "Pro" && <Crown size={13} className="text-[#238B45]" />}
                          {pricingType}
                        </span>
                      </span>
                    </div>
                  </div>

                  {visibleStatus && (
                    <p className={`rounded-xl border px-3 py-2 text-xs font-bold ${getStatusTone(visibleStatus)}`}>
                      {visibleStatus}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#238B45] px-5 text-sm font-extrabold text-white shadow-lg shadow-[#238B45]/20 transition hover:bg-[#2a9d50] disabled:cursor-wait disabled:opacity-70"
                    >
                      {isSubmitting && <Loader2 size={17} className="animate-spin" />}
                      {isSubmitting ? "Saving..." : mode === "create" ? "Save Component" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
        </section>
    </div>
  );
}
