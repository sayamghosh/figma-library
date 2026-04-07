import { useState } from "react";
import type { FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { componentsApi } from "../api/components";
import { uploadApi } from "../api/upload";
import { extractFigmaBase64FromPaste } from "../lib/clipboard";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/add-component")({
  component: AddComponentPage,
});

function AddComponentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [figmaDataBase64, setFigmaDataBase64] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Paste from Figma into the extractor field below.");

  const addComponentMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      tags: string[];
      figmaDataBase64: string;
      previewFile: File;
    }) => {
      const previewImageUrl = await uploadApi.uploadImage(input.previewFile);
      return componentsApi.create({
        name: input.name,
        description: input.description,
        tags: input.tags,
        previewImageUrl,
        figmaDataBase64: input.figmaDataBase64,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
  });

  async function onPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    try {
      const value = await extractFigmaBase64FromPaste(event.nativeEvent as ClipboardEvent);
      setFigmaDataBase64(value);
      setStatus(`Captured Figma payload (${value.length} base64 chars).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not extract payload.");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!previewFile) {
      setStatus("Please select a preview image file.");
      return;
    }

    if (!figmaDataBase64.trim()) {
      setStatus("Paste a Figma component in the extractor field first.");
      return;
    }

    setStatus("Uploading image to Cloudinary...");

    try {
      await addComponentMutation.mutateAsync({
        name,
        description,
        tags: tagsInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        figmaDataBase64,
        previewFile,
      });
      setStatus("Component added successfully.");
      navigate({ to: "/components" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not add component.");
    }
  }

  if (!user) {
    return (
      <section className="auth-card">
        <h2>Authentication Required</h2>
        <p>You must sign in to add components.</p>
        <Link to="/auth/login" className="primary-btn">
          Go to Login
        </Link>
      </section>
    );
  }

  return (
    <section className="add-page">
      <h2>Add Your Component</h2>
      <p className="status-text">{status}</p>

      <form className="stack-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Component name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setPreviewFile(event.target.files?.[0] || null)}
          required
        />

        <label className="field-label" htmlFor="figmaPaste">
          Figma Payload Extractor (click then press Ctrl+V)
        </label>
        <textarea
          id="figmaPaste"
          placeholder="Paste from Figma here..."
          rows={7}
          value={figmaDataBase64}
          onPaste={onPaste}
          onChange={(event) => setFigmaDataBase64(event.target.value)}
          required
        />

        <button className="primary-btn" type="submit" disabled={addComponentMutation.isPending}>
          {addComponentMutation.isPending ? "Saving..." : "Save Component"}
        </button>
      </form>
    </section>
  );
}
