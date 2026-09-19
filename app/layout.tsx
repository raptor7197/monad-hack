import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlipGuard — Fair votes. Stronger governance.",
  description: "Onchain governance guard that blocks suspicious last-minute voting power on Monad Testnet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <Providers>
          <div className="border-b border-warn/20 bg-warn/10 px-4 py-2 text-center text-xs text-warn">
            Hackathon demo: DAO activity and monitoring signals are simulated. Governance enforcement runs on Monad Testnet.
          </div>
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">{children}</main>
          <footer className="border-t border-line py-6 text-center text-xs text-dim">
            FlipGuard · Fair votes. Stronger governance. · Built for Monad Blitz Mumbai V4
          </footer>
        </Providers>
      </body>
    </html>
  );
}
