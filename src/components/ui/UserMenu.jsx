"use client";

import React, { useEffect, useRef, useState } from "react";
import LogoutBtn from "@/components/ui/sidebar/LogoutBtn";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const initial = (user?.name || "?").charAt(0).toUpperCase();
  const email = user?.email || "";

  // Close on outside click / ESC
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu-panel"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-400/60 text-slate-900 ring-2 ring-transparent transition-all duration-200 hover:ring-indigo-400 dark:bg-slate-600 dark:text-white dark:hover:ring-indigo-500"
        title={user?.name || "Account"}
      >
        <span className="text-md font-semibold">{initial}</span>
      </button>

      {/* Dropdown */}
      <div
        id="user-menu-panel"
        role="menu"
        tabIndex={-1}
        className={[
          "absolute top-full right-0 mt-2 w-64 origin-top-right rounded-xl bg-white/80 p-2 text-sm shadow-lg ring-1 ring-slate-200/80 backdrop-blur-lg transition-all duration-200 dark:bg-slate-800/80 dark:ring-slate-700",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        ].join(" ")}
      >
        <div className="p-2">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {user?.name}
          </p>
          <p className="text-slate-500 dark:text-slate-400 truncate">{email}</p>
        </div>

        <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />

        {/* Sign out (server action) */}
        <LogoutBtn
          avatar
          onClick={() => setOpen(false)}
          aria-label="Sign out"
        />
      </div>
    </div>
  );
}
