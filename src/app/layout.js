// src/app/layout.tsx (or .jsx)
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { headers } from "next/headers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Perktify Portal",
  description: "Perktify Portal allows to manage and track the rewards efficiently",
};

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer theme="light" position="top-right" />
        <NextTopLoader color="#192048" height={6} showSpinner={false} />

        {/* Example: if you ever add inline scripts, pass the nonce */}
        {/* <Script id="bootstrap" nonce={nonce}>{`window.__APP__ = { v: 1 }`}</Script> */}
      </body>
    </html>
  );
}
