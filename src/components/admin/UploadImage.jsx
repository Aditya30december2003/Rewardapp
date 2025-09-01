"use client";
import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const MAX_MB = 8;

const UploadImage = ({ prefs, image, Title, bodyColor }) => {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPicker = () => fileInputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isOkSize = file.size <= MAX_MB * 1024 * 1024;

    if (!isImage) {
      toast.error("Please choose an image file.");
      e.target.value = "";
      return;
    }
    if (!isOkSize) {
      toast.error(`Image must be ≤ ${MAX_MB}MB.`);
      e.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.target);
    const file = formData.get("file");

    if (!file || file.size === 0) {
      toast.info("Please select an image first.");
      return;
    }

    setIsSubmitting(true);
    formData.append("dbId", prefs.dbId);
    formData.append("type", image);

    try {
      const res = await fetch("/api/update-logo", { method: "POST", body: formData });
      if (res.ok) {
        toast.success(`${Title} updated successfully!`);
      } else {
        toast.error(`Failed to upload ${Title}. Please try again.`);
      }
    } catch (error) {
      toast.error(`Failed to upload ${Title}. Please try again.`);
      console.error(`ERROR uploading ${Title}`, error);
    } finally {
      setIsSubmitting(false);
      formRef.current?.reset();
    }
  };

  return (
    <div
      className="
        group relative w-full max-w-md
        rounded-2xl border border-default-200/70
        bg-gradient-to-b from-white to-default-50
        dark:from-default-50 dark:to-default-100
        shadow-md hover:shadow-xl transition
        ring-1 ring-transparent hover:ring-default-200/80
        p-6
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground capitalize leading-none">
            {Title}
          </h3>
          <p className="mt-1 text-sm text-default-600">
            PNG, JPG, SVG • up to {MAX_MB}MB
          </p>
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              formRef.current?.reset();
            }}
            className="inline-flex items-center justify-center rounded-full p-2 border border-default-200 bg-white text-default-800 hover:bg-default-100 shadow-sm"
            aria-label={`Remove ${Title}`}
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Preview */}
      <div
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
        className="
          relative overflow-hidden rounded-xl
          aspect-[4/3]
          border border-dashed border-default-300
          bg-white/70 dark:bg-default-50/70
          hover:border-default-400 focus:outline-none
          flex items-center justify-center
          cursor-pointer
        "
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${Title} preview`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="text-center px-4">
            <div className="text-sm font-medium text-default-700">
              Click to upload
            </div>
            <div className="text-xs text-default-500 mt-0.5">or drag & drop</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <form ref={formRef} onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openPicker}
            className="
              inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium
              border border-default-300 bg-white hover:bg-default-100
            "
          >
            Choose file
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white
              disabled:opacity-60 disabled:cursor-not-allowed transition
            "
            style={{ backgroundColor: bodyColor || "#ae6af5" }}
          >
            {isSubmitting ? "Uploading…" : "Save"}
          </button>
        </div>

        <p className="text-xs text-default-500">
          Tip: Use a transparent PNG or SVG for the cleanest look.
        </p>
      </form>
    </div>
  );
};

export default UploadImage;
