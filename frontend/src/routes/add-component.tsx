import { useState } from "react";
import type { FormEvent } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { componentsApi } from "../api/components";
import { uploadApi } from "../api/upload";
import { extractFigmaBase64FromPaste } from "../lib/clipboard";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/add-component")({
  component: AddComponentPage,
});

function AddComponentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [figmaDataBase64, setFigmaDataBase64] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Paste from Figma into the extractor field below.");
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);
    setStatus("Uploading image to Cloudinary...");

    try {
      const previewImageUrl = await uploadApi.uploadImage(previewFile);
      setStatus("Saving component...");
      await componentsApi.create({
        name,
        description,
        tags: tagsInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        previewImageUrl,
        figmaDataBase64,
      });
      setStatus("Component added successfully.");
      navigate({ to: "/components" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not add component.");
    } finally {
      setSubmitting(false);
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

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Component"}
        </button>
      </form>
    </section>
  );
}
