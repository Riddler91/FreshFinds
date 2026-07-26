"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, X, Link, Upload } from "lucide-react";

interface ImageUploadProps {
  value: string;              // current URL (from file upload or manual URL)
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;       // e.g. "2/1" for cover, "16/9" for listings
}

export default function ImageUpload({
  value,
  onChange,
  label = "Photo",
  aspectRatio = "2/1",
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await res.json();
        onChange(data.url);
        setPreview(data.url);
        setShowUrlInput(false);
      } catch (err: any) {
        setError(err.message || "Upload failed");
      } finally {
        setUploading(false);
        setDragging(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPreview(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-1.5">{label}</label>

      {/* Preview */}
      {preview ? (
        <div
          className="relative rounded-2xl bg-cream-100 overflow-hidden shadow-warm mb-3"
          style={{ aspectRatio }}
        >
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <span className="animate-spin text-2xl">⏳</span>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
            dragging
              ? "border-sage-400 bg-sage-50"
              : "border-cream-300 bg-cream-50 hover:border-sage-300 hover:bg-cream-50/80"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          style={{ aspectRatio: uploading ? undefined : aspectRatio }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <span className="animate-spin text-3xl mb-2">⏳</span>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-sage-500" />
              </div>
              <p className="text-sm font-bold text-ink mb-1">
                Drag & drop a photo
              </p>
              <p className="text-xs text-ink-muted mb-3">
                or tap to choose
              </p>
              <span className="text-xs bg-white border border-cream-200 px-4 py-2 rounded-full font-semibold text-ink-light">
                <Upload className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Choose Photo
              </span>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-terra-500 mt-1.5 font-medium">{error}</p>
      )}

      {/* "Or paste URL" fallback */}
      {!showUrlInput ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowUrlInput(true);
          }}
          className="text-xs text-sage-600 font-medium mt-2 hover:text-sage-700 transition-colors flex items-center gap-1"
        >
          <Link className="w-3.5 h-3.5" />
          or paste an image URL
        </button>
      ) : (
        <div className="flex gap-2 mt-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-xs text-ink placeholder-ink-muted/50 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 outline-none font-sans"
            autoFocus
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-sage-100 text-sage-700 rounded-xl text-xs font-bold hover:bg-sage-200 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
