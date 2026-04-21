import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/src/app/globals.css";
import { LanguageProvider, ToastProvider } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DG NEAR 2 Project",
  description:
    "Secure entrepreneur database management platform for DG NEAR 2 beneficiaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
