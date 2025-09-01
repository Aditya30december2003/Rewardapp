import React from "react";
import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-white text-gray-600">


      {/* Bottom section with copyright */}
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex items-center justify-center gap-2">
                <img className="h-7 w-7" src="/perktify-logo.png" alt="Perktify Logo" />
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} - Powered by <span className="font-semibold text-gray-800">Perktify</span>
                </p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;