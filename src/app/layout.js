import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Perktify Portal",
  description:
    "Perktify Portal allows to manage and track the rewards efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer theme="light" position="top-right" />
        <NextTopLoader color="#192048" height={6} showSpinner={false} />
      </body>
    </html>
  );
}
