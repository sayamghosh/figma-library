export function base64ToUint8Array(base64: string): Uint8Array {
  const clean = (base64 || "").trim();
  if (!clean) {
    return new Uint8Array();
  }
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function buildFigmaHtmlPayload(base64: string, componentName: string): string {
  const clean = (base64 || "").replace(/\s+/g, "");
  const figMeta = {
    fileKey: "local-library",
    pasteID: Date.now(),
    dataType: "scene",
    componentName: componentName || "component",
  };
  const figMetaBase64 = btoa(JSON.stringify(figMeta));
  return `<html><body><!--StartFragment--><meta charset="utf-8"><span data-metadata="<!--(figmeta)${figMetaBase64}(/figmeta)-->"></span><span data-buffer="<!--(figma)${clean}(/figma)-->"></span><!--EndFragment--></body></html>`;
}

export async function copyToFigma(base64: string, componentName: string): Promise<string> {
  if (!window.ClipboardItem || !navigator.clipboard || !navigator.clipboard.write) {
    throw new Error("ClipboardItem API is not available in this browser context.");
  }

  const bytes = base64ToUint8Array(base64);
  if (!bytes.length) {
    throw new Error("No figmaDataBase64 found for this component.");
  }

  const stableBytes = Uint8Array.from(bytes) as Uint8Array<ArrayBuffer>;
  const blob = new Blob([stableBytes], { type: "application/x-figma" });

  try {
    const directItem = new ClipboardItem({ "application/x-figma": blob });
    await navigator.clipboard.write([directItem]);
    return "copied-binary";
  } catch {
    const htmlPayload = buildFigmaHtmlPayload(base64, componentName);
    const htmlItem = new ClipboardItem({
      "text/html": new Blob([htmlPayload], { type: "text/html" }),
      "text/plain": new Blob([componentName || "Figma component"], { type: "text/plain" }),
    });
    await navigator.clipboard.write([htmlItem]);
    return "copied-html-fallback";
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

function extractFigmaBase64FromHtml(html: string): string | null {
  if (!html) {
    return null;
  }
  const markerRegex = new RegExp("<!--\\(figma\\)([\\s\\S]*?)\\(\\/figma\\)-->", "i");
  const markerMatch = html.match(markerRegex);
  if (!markerMatch || !markerMatch[1]) {
    return null;
  }

  const candidate = markerMatch[1].replace(/\s+/g, "").trim();
  if (!candidate || !/^[A-Za-z0-9+/=]+$/.test(candidate)) {
    return null;
  }

  return candidate;
}

export async function extractFigmaBase64FromPaste(event: ClipboardEvent): Promise<string> {
  const clipboard = event.clipboardData;
  if (!clipboard) {
    throw new Error("No clipboardData found on paste event.");
  }

  event.preventDefault();

  const items = Array.from(clipboard.items || []);
  const bestItem =
    items.find((item) => (item.type || "").toLowerCase() === "application/x-figma") ||
    items.find((item) => (item.type || "").toLowerCase().includes("figma")) ||
    items.find((item) => item.kind === "file");

  if (bestItem) {
    const file = bestItem.getAsFile();
    if (file) {
      const buffer = await file.arrayBuffer();
      return arrayBufferToBase64(buffer);
    }
  }

  const html = clipboard.getData("text/html") || "";
  const extractedBase64 = extractFigmaBase64FromHtml(html);
  if (extractedBase64) {
    return extractedBase64;
  }

  throw new Error("No readable Figma payload was found in the pasted content.");
}
