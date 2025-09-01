"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    setEmail("");
  };

  return (
    <footer style={{ marginTop: "10%" }} className="bg-gray-900 text-white pt-12 pb-8">
  


      {/* Copyright */}
      <div className="container mx-auto px-4 text-center border-t border-gray-800 pt-6">
        <p className="text-gray-400">
          © Copyright <strong className="text-white">Perktify</strong>. All Rights Reserved
        </p>
        <div className="text-gray-500 text-sm mt-2">
          Designed by{" "}
          <a
            href="https://techistlab.co.uk/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
           Techistlab & Partners
          </a>
        </div>
      </div>
    </footer>
  );
}

/* Tiny dot icon for pills */
function Dot() {
  return (
    <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="5" r="5" />
    </svg>
  );
}
