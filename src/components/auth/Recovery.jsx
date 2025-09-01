"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { BiSolidError } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { resendOTP, sendRecoveryLink } from "@/lib/actions";

/**
 * Props:
 * - variant: "card" | "bare" (default "card")
 * - className: optional extra classes for the outermost wrapper
 */
const Recovery = ({ variant = "card", className = "" }) => {
  const initialState = { message: "", type: undefined };
  const [state, formAction] = useFormState(sendRecoveryLink, initialState);

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!state?.type) return;
    if (state.type === "success") {
      toast.success(state.message || "Recovery link sent.");
      setIsResendDisabled(true);
      setTimer(60);
      setIsSubmitting(false);
    } else if (state.type === "error") {
      toast.error(state.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  }, [state]);

  // Countdown
  useEffect(() => {
    if (!isResendDisabled) return;
    if (timer <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isResendDisabled, timer]);

  // Resend
  const handleResendLink = async (e) => {
    e.preventDefault();
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    setTimer(60);
    try {
      const r = await resendOTP();
      if (r && r.message) toast.info(r.message);
      else toast.info("Recovery link resent.");
    } catch {
      toast.error("Could not resend link. Please try again.");
      setIsResendDisabled(false);
      setTimer(0);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
  };

  // --- UI wrappers depending on variant ---
  const Outer = ({ children }) =>
    variant === "card" ? (
      <div
        className={[
          "w-full max-w-md mx-4",
          "rounded-3xl p-[1px]",
          "bg-gradient-to-br from-white/30 via-white/10 to-white/30",
          "shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
          "backdrop-blur-[2px]",
          className,
        ].join(" ")}
      >
        <div
          className={[
            "rounded-3xl",
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_100%)]",
            "backdrop-blur-2xl",
            "border border-white/20",
            "px-6 py-7",
          ].join(" ")}
          role="region"
          aria-label="Password recovery form"
        >
          {children}
        </div>
      </div>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <Outer>
      {/* Header */}
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 relative h-12 w-12">
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div className="absolute inset-[-3px] rounded-full border border-white/30" />
          <div className="relative flex h-12 w-12 items-center justify-center">
            <HiOutlineRefresh className="h-6 w-6 text-white" aria-hidden />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Password Recovery
        </h2>
        <p className="mt-2 text-sm text-white/75">
          Enter your account email to get a secure recovery link.
        </p>
      </div>

      {/* Inline error */}
      {state?.type === "error" && state?.message ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          <BiSolidError className="h-5 w-5" aria-hidden />
          <span>{state.message}</span>
        </div>
      ) : null}

      {/* Resend */}
      <div className="mb-4 flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
        <button
          onClick={handleResendLink}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            isResendDisabled
              ? "cursor-not-allowed border border-white/15 bg-white/10 text-white/60"
              : "border border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]"
          }`}
          aria-disabled={isResendDisabled}
          aria-live="polite"
          type="button"
        >
          <HiOutlineRefresh
            className={`h-5 w-5 ${isResendDisabled ? "animate-spin" : ""}`}
            aria-hidden
          />
          {isResendDisabled ? (
            <span>Resend available in {timer}s</span>
          ) : (
            <span>Resend recovery link</span>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center text-white/50">
        <span className="flex-1 border-t border-white/20" />
        <span className="mx-3 text-[10px] uppercase tracking-wider">Continue</span>
        <span className="flex-1 border-t border-white/20" />
      </div>

      {/* Form */}
      <form
        action={async (formData) => {
          await onSubmit();
          await formAction(formData);
        }}
        ref={formRef}
        className="space-y-3"
      >
        <div className="space-y-1">
          <label
            htmlFor="recovery-email"
            className="block text-xs font-medium uppercase tracking-wide text-white/80"
          >
            Email
          </label>
          <Input
            id="recovery-email"
            label=""
            placeholder="name@example.com"
            type="email"
            name="email"
            aria-describedby="recovery-help"
            aria-required="true"
          />
          <p id="recovery-help" className="text-xs text-white/60">
            We’ll send a one-time secure link to reset your password.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            isSubmitting ? "cursor-not-allowed opacity-80" : ""
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isSubmitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-75"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span>{isSubmitting ? "Sending..." : "Send Recovery Link"}</span>
          </span>
        </Button>
      </form>

      {/* Helper */}
      <div className="mt-5 text-center text-xs text-white/60">
        Having trouble? Check your spam folder or try resending.
      </div>
    </Outer>
  );
};

export default Recovery;
