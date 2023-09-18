import { GlobalDataProvider } from "@/hooks/useGlobalData";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bidsync",
  description: "Hackathon winning app!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <ToastContainer />
          <GlobalDataProvider>

          {children}
          </GlobalDataProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
