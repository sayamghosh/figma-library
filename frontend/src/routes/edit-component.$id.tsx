import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { componentsApi } from "../api/components";
import { uploadApi } from "../api/upload";
import { extractFigmaBase64FromPaste } from "../lib/clipboard";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/edit-component/$id")({
  component: EditComponentPage,
});

const FAKE_SYSTEM_LOG = {
  binary: Array.from({ length: 4 }).map(() => Math.random().toString(2).substring(2, 26)).join('\n  ')
};

function EditComponentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setLoginModalOpen } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [figmaDataBase64, setFigmaDataBase64] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [designType, setDesignType] = useState<"Wireframe" | "UI Design">("UI Design");
  const [pricingType, setPricingType] = useState<"Free" | "Pro">("Free");
  const [status, setStatus] = useState("");

  const { data: componentData, isLoading } = useQuery({
    queryKey: ["components", id],
    queryFn: () => componentsApi.getById(id),
    enabled: !!id,
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (componentData && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(componentData.name || "");
      setDescription(componentData.description || "");
      setTags(componentData.tags || []);
      setFigmaDataBase64(componentData.figmaDataBase64 || "");
      setDesignType(componentData.designType || "UI Design");
      setPricingType(componentData.pricingType || "Free");
      setInitialized(true);
    }
  }, [componentData, initialized]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const newTags = val.split(",").map(t => t.trim()).filter(Boolean);
      if (newTags.length > 0) {
        setTags(prev => [...prev, ...newTags]);
      }
      setTagInputValue("");
    } else {
      setTagInputValue(val);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInputValue.trim()) {
        setTags(prev => [...prev, tagInputValue.trim()]);
        setTagInputValue("");
      }
    } else if (e.key === "Backspace" && !tagInputValue && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const updateComponentMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      tags: string[];
      figmaDataBase64: string;
      previewFile: File | null;
      designType: "Wireframe" | "UI Design";
      pricingType: "Free" | "Pro";
    }) => {
      let previewImageUrl;
      if (input.previewFile) {
        previewImageUrl = await uploadApi.uploadImage(input.previewFile);
      }
      return componentsApi.update(id, {
        name: input.name,
        description: input.description,
        tags: input.tags,
        ...(previewImageUrl ? { previewImageUrl } : {}),
        figmaDataBase64: input.figmaDataBase64,
        designType: input.designType,
        pricingType: input.pricingType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
      queryClient.invalidateQueries({ queryKey: ["my-components"] });
    },
  });

  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "file" && (target as HTMLInputElement).type !== "checkbox" && (target as HTMLInputElement).type !== "radio") ||
        target.tagName === "TEXTAREA"
      ) {
        if (target.id !== "figmaPaste") {
          return;
        }
      }

      try {
        const value = await extractFigmaBase64FromPaste(e);
        if (value) {
          setFigmaDataBase64(value);
          setStatus("Captured Figma payload successfully.");
        }
      } catch (error) {
        if (target.id === "figmaPaste") {
          setStatus(error instanceof Error ? error.message : "Could not extract payload.");
        }
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!figmaDataBase64.trim()) {
      setStatus("Paste a Figma component in the extractor field first.");
      return;
    }

    if (previewFile) {
      setStatus("Uploading new image to Cloudinary...");
    } else {
      setStatus("Updating component...");
    }

    try {
      await updateComponentMutation.mutateAsync({
        name,
        description,
        tags: [...tags, ...tagInputValue.split(",").map(t => t.trim())].filter(Boolean),
        figmaDataBase64,
        previewFile,
        designType,
        pricingType,
      });
      setStatus("Component updated successfully.");
      navigate({ to: "/my-components" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update component.");
    }
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 bg-gray-50/50 backdrop-blur-sm">
        <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold font-syne text-[#10131A] mb-2">Authentication Required</h2>
          <p className="text-gray-500 text-sm mb-6">You must sign in to edit your components.</p>
          <button 
            type="button" 
            onClick={() => setLoginModalOpen(true)} 
            className="w-full bg-[#8A2BE2] text-white rounded-lg py-2.5 font-bold shadow-sm shadow-purple-500/20 hover:bg-[#7b22cc] hover:-translate-y-0.5 transition-all text-sm font-syne"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading component details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 bg-gray-50/50 backdrop-blur-sm pt-12 pb-20">
      <div className="relative w-full max-w-[850px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex-1 flex flex-col p-6 sm:p-8 bg-white">
          <div className="w-full mx-auto flex flex-col justify-center h-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold font-syne text-[#10131A] mb-1">Edit Component</h2>
              <p className="text-gray-500 text-[0.8rem] font-medium">Update the details for this component</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Component Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hero Section V2"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent transition-all shadow-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Tags</label>
                    <div className="w-full px-2 py-1.5 min-h-[38px] rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8A2BE2] focus-within:border-transparent transition-all shadow-sm flex flex-wrap gap-1.5 items-center cursor-text" onClick={(e) => (e.currentTarget.lastElementChild as HTMLElement)?.focus()}>
                      {tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#8A2BE2]/10 text-[#8A2BE2] px-2 py-0.5 rounded flex items-center gap-1 text-xs font-medium">
                          {tag}
                          <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-500 rounded-full w-3 h-3 flex items-center justify-center bg-transparent border-none p-0 ml-0.5">×</button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={tags.length === 0 ? "e.g. hero, landing, dark" : ""}
                        value={tagInputValue}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 py-0.5 px-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Description</label>
                    <textarea
                      placeholder="Briefly describe this component..."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent transition-all shadow-sm text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Design Type</label>
                      <select
                        value={designType}
                        onChange={(e) => setDesignType(e.target.value as "Wireframe" | "UI Design")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent transition-all shadow-sm text-sm"
                      >
                        <option value="UI Design">UI Design</option>
                        <option value="Wireframe">Wireframe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Pricing</label>
                      <select
                        value={pricingType}
                        onChange={(e) => setPricingType(e.target.value as "Free" | "Pro")}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent transition-all shadow-sm text-sm"
                      >
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Preview Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setPreviewFile(event.target.files?.[0] || null)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent transition-all shadow-sm text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#8A2BE2]/10 file:text-[#8A2BE2] hover:file:bg-[#8A2BE2]/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current preview image.</p>
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <label className="block text-[0.75rem] font-semibold text-gray-700 mb-0.5 font-syne uppercase tracking-wider">Figma Payload</label>
                  <div 
                    className={`w-full flex-1 relative overflow-hidden rounded-lg border-2 transition-all min-h-[160px] flex flex-col justify-center ${figmaDataBase64 ? 'border-green-500 bg-green-50/30' : 'border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50'}`}
                  >
                    {figmaDataBase64 ? (
                      <div className="p-4 flex flex-col items-center">
                        <div className="w-full bg-slate-900 rounded-md p-3 relative overflow-hidden">
                          <pre className="text-[0.65rem] text-green-400 font-mono leading-tight max-h-[80px] overflow-hidden opacity-70 break-all pointer-events-none select-none">
{`<!--(figmeta)eyJmaWxlS2V5IjoibG9jYWwtbGlicmFyeSIsInBhc3R...
[ENCRYPTED_PAYLOAD_CHUNK_0x9A4B]
[SYSTEM_VERIFIED_FIGMA_NODE]
<binary-stream chunks="128" mode="base64-encoded" status="verified">
  ${FAKE_SYSTEM_LOG.binary}
</binary-stream>`}
                          </pre>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-green-400">Payload Captured</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFigmaDataBase64("")}
                          className="mt-3 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Remove & Start Over
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center h-full">
                        <div className="w-10 h-10 rounded-full bg-[#8A2BE2]/10 flex items-center justify-center text-[#8A2BE2]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Paste your Figma component</p>
                          <p className="text-xs text-gray-500 mt-1">Copy directly from Figma and paste it here</p>
                        </div>
                        
                        <textarea
                          id="figmaPaste"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer resize-none"
                          value=""
                          onChange={() => {}}
                          placeholder="Click here and press Ctrl+V"
                        />

                        <div className="mt-2 relative z-10">
                          <span className="text-xs text-gray-500 font-medium px-4 py-1.5 bg-gray-100 rounded-md border border-gray-200 shadow-sm pointer-events-none">Press Ctrl + V</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                {status && (
                  <p className={`text-xs font-medium p-2 rounded ${
                    status.includes("success") || status.includes("Captured") ? "text-green-600 bg-green-50" : 
                    status.includes("Updating") || status.includes("Uploading") ? "text-blue-600 bg-blue-50" : 
                    status.includes("Paste") ? "text-gray-500 bg-gray-50" : "text-red-600 bg-red-50"
                 }`}>
                    {status}
                  </p>
                )}

                <button 
                  className="w-full bg-[#8A2BE2] text-white rounded-lg py-2.5 font-bold shadow-sm shadow-purple-500/20 hover:bg-[#7b22cc] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 font-syne text-sm" 
                  type="submit" 
                  disabled={updateComponentMutation.isPending}
                >
                  {updateComponentMutation.isPending ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
