import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["700", "800"] });

export const metadata: Metadata = {
  title: "FlipGuard — Fair votes. Stronger governance.",
  description: "Onchain governance guard that blocks suspicious last-minute voting power on Monad Testnet.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable} antialiased`}>
      <body className="min-h-screen font-sans bg-bg text-ink">
        <Providers>
          <div className="border-b border-border bg-surface-2 px-4 py-2 text-center text-xs font-mono uppercase tracking-wider text-muted">
            Monad Testnet Governance Protection · Demo Protocol
          </div>
          <SiteHeader />
          <main className="w-full">{children}</main>
          <footer className="border-t border-border py-8 text-center text-xs text-muted">
            FlipGuard · Fair votes. Stronger governance. · Monad Blitz Mumbai
          </footer>
        </Providers>
      </body>
    </html>
  );
}
