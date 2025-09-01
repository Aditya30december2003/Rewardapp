"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Contactus() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.comments) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    // Simulate request
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: "success", message: "Thanks! We've received your message." });
      form.reset();
    }, 900);
  }

  return (
    <>
      {/* Clean white background */}
      <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div  className="container relative w-full max-w-4xl mx-auto">
          {/* Simplified Heading */}
          <div  className="relative mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get in touch
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Questions, feedback, or partnership ideas—we're here to help.
            </p>
          </div>

          <div   className="grid md:grid-cols-2 grid-cols-1 items-center gap-10">
            {/* Illustration with animation */}
            <div   className="order-2 md:order-1 overflow-hidden">
              <div className={`transform transition-all duration-700 ease-out ${
                imageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                <Image
                  src="/contact.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", marginLeft:"-9%"}}
                  alt="Contact illustration"
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>

            {/* Form */}
            <div  className="order-1 md:order-2">
              <h3 className="mb-6 text-2xl font-semibold text-slate-900">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* status message */}
                {status.message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className={`rounded-lg px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <input
                        name="name"
                        id="name"
                        type="text"
                        className="w-full h-11 rounded-lg bg-white border border-slate-200 text-slate-900 outline-none pl-9 pr-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Email
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                        <MailIcon className="h-4 w-4" />
                      </span>
                      <input
                        name="email"
                        id="email"
                        type="email"
                        className="w-full h-11 rounded-lg bg-white border border-slate-200 text-slate-900 outline-none pl-9 pr-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Question
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
                      <ChatIcon className="h-4 w-4" />
                    </span>
                    <input
                      name="subject"
                      id="subject"
                      type="text"
                      className="w-full h-11 rounded-lg bg-white border border-slate-200 text-slate-900 outline-none pl-9 pr-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Message
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-3 opacity-60">
                      <PencilIcon className="h-4 w-4" />
                    </span>
                    <textarea
                      name="comments"
                      id="comments"
                      className="w-full min-h-[120px] rounded-lg bg-white border border-slate-200 text-slate-900 outline-none pl-9 pr-3 pt-2 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition"
                      placeholder="Your message..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit"
                  name="send"
                  disabled={loading}
                  className={`w-full group relative inline-flex items-center justify-center gap-2 rounded-lg px-5 h-11 text-white font-semibold transition
                    ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {loading ? (
                    <>
                      <Spinner className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Alt contact */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Prefer email? Write to{" "}
                <a href="mailto:support@example.com" className="font-medium text-indigo-600 hover:text-indigo-700">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Tiny inline icons (no external deps) ---------- */
function UserIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
    </svg>
  );
}
function MailIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 3l-8 5L4 7V6l8 5 8-5z" />
    </svg>
  );
}
function ChatIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4h16v10H7l-3 3V4z" />
    </svg>
  );
}
function PencilIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}
function ArrowRight(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}
function Spinner(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}