"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

// Helpers for contrast checking
function hexToRgb(hex) {
  if (!hex) return [0, 0, 0];
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function luminance([r, g, b]) {
  const srgb = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(c1, c2) {
  const L1 = luminance(hexToRgb(c1));
  const L2 = luminance(hexToRgb(c2));
  const [light, dark] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}
function isValidHex(v) {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(v);
}

const DashboardColorPicker = ({ prefs, getBodyColor, getAccentColor }) => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bodyColor, setBodyColor] = useState("#ae6af5");
  const [accentColor, setAccentColor] = useState("#ec89a7");

  // text inputs synced with color pickers
  const [bodyHex, setBodyHex] = useState("#ae6af5");
  const [accentHex, setAccentHex] = useState("#ec89a7");

  useEffect(() => {
    if (getBodyColor) {
      setBodyColor(getBodyColor);
      setBodyHex(getBodyColor);
    }
    if (getAccentColor) {
      setAccentColor(getAccentColor);
      setAccentHex(getAccentColor);
    }
  }, [getBodyColor, getAccentColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // guard invalid hex values
    if (!isValidHex(bodyHex) || !isValidHex(accentHex)) {
      toast.error("Please enter valid HEX colors (e.g. #AABBCC).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        bodyColor: bodyHex,
        accentColor: accentHex,
        dbId: prefs.dbId,
      };

      const res = await fetch("/api/update-color", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setBodyColor(bodyHex);
        setAccentColor(accentHex);
        toast.success("Color updated successfully!");
      } else {
        toast.error("Failed to update color");
      }
    } catch (error) {
      console.error("ERROR in Color", error);
      toast.error("Failed to update Color. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const swapColors = () => {
    setBodyHex(accentHex);
    setAccentHex(bodyHex);
  };

  const resetColors = () => {
    setBodyHex(getBodyColor || "#ae6af5");
    setAccentHex(getAccentColor || "#ec89a7");
  };

  // a11y contrast check (body on white, text on body)
  const ratioTextOnBody = contrastRatio(bodyHex, "#ffffff");
  const ratioBodyOnWhite = contrastRatio(bodyHex, "#ffffff");
  const meetsAA = (ratio) => ratio >= 4.5;
  const meetsAAA = (ratio) => ratio >= 7;

  return (
    <div
      className="
        group relative w-full max-w-md
        rounded-2xl border border-default-200/70
        bg-gradient-to-b from-white to-default-50 dark:from-default-50 dark:to-default-100
        shadow-md hover:shadow-xl transition
        ring-1 ring-transparent hover:ring-default-200/80
        p-6
        min-h-[300px]
      "
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Theme Colors</h3>
        <p className="text-sm text-default-600 mt-1">
          Set the primary (body) and accent colors for your public form.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Body color */}
        <div className="space-y-2">
          <label htmlFor="bodyColor" className="text-sm font-medium text-foreground">
            Body color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="bodyColor"
              name="bodyColor"
              value={bodyHex}
              onChange={(e) => setBodyHex(e.target.value)}
              className="w-12 h-10 border border-default-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={bodyHex}
              onChange={(e) => setBodyHex(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
              className="flex-1 rounded-md border border-default-300 bg-white px-3 py-2 text-sm"
              placeholder="#AE6AF5"
            />
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-[11px] border"
              style={{ backgroundColor: bodyHex, color: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
            >
              Preview
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-default-600">
            <span>Contrast on white:</span>
            <span className="font-semibold">{ratioBodyOnWhite.toFixed(2)}:1</span>
            <span className={`px-1.5 py-0.5 rounded ${meetsAA(ratioBodyOnWhite) ? "bg-green-100 text-green-700" : "bg-default-100 text-default-700"}`}>
              {meetsAA(ratioBodyOnWhite) ? "AA" : "AA?"}
            </span>
            <span className={`px-1.5 py-0.5 rounded ${meetsAAA(ratioBodyOnWhite) ? "bg-green-100 text-green-700" : "bg-default-100 text-default-700"}`}>
              {meetsAAA(ratioBodyOnWhite) ? "AAA" : "AAA?"}
            </span>
          </div>
        </div>

        {/* Accent color */}
        <div className="space-y-2">
          <label htmlFor="accentColor" className="text-sm font-medium text-foreground">
            Accent color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="accentColor"
              name="accentColor"
              value={accentHex}
              onChange={(e) => setAccentHex(e.target.value)}
              className="w-12 h-10 border border-default-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={accentHex}
              onChange={(e) => setAccentHex(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
              className="flex-1 rounded-md border border-default-300 bg-white px-3 py-2 text-sm"
              placeholder="#EC89A7"
            />
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-[11px] border"
              style={{ backgroundColor: accentHex, color: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
            >
              Preview
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapColors}
            className="rounded-md border border-default-300 bg-white px-3 py-2 text-xs font-medium hover:bg-default-100"
          >
            Swap
          </button>
          <button
            type="button"
            onClick={resetColors}
            className="rounded-md border border-default-300 bg-white px-3 py-2 text-xs font-medium hover:bg-default-100"
          >
            Reset
          </button>
        </div>

        {/* Save */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white
              disabled:opacity-60 disabled:cursor-not-allowed transition
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            "
            style={{ backgroundColor: bodyColor || "#ae6af5" }}
          >
            {isSubmitting ? "Updating…" : "Save"}
          </button>
        </div>
      </form>

      {/* Decorative corner glow like UploadImage */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition"
        style={{
          background:
            "radial-gradient(400px circle at 90% -10%, rgba(255,255,255,0.6), transparent 40%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default DashboardColorPicker;
