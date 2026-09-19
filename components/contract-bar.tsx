"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { governance } from "@/lib/contracts";
import { addressLink } from "@/lib/monad";

export function ContractBar() {
  const [copied, setCopied] = useState(false);
  const contractAddr = governance.address || "0x9c368D5bA4F5b5d18d407817D5eA0A4815a5E3A7";

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-label="Contract Deployment" className="w-full border-b border-border bg-surface-2 py-10 md:py-14">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
        <h2
          className="font-display font-extrabold uppercase text-ink whitespace-nowrap text-center md:text-left"
          style={{ fontSize: "clamp(20px, 3vw, 40px)", letterSpacing: "-0.03em" }}
        >
          GOVERNANCE CONTRACT
        </h2>

        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1 rounded-2xl border border-border bg-surface px-4 py-3 flex items-center justify-between overflow-hidden">
            <span className="font-mono text-xs md:text-sm text-ink truncate select-all">{contractAddr}</span>
            <span className="ml-2 font-mono text-[10px] uppercase text-muted shrink-0">Monad 10143</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyAddress}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-display font-extrabold text-xs uppercase px-5 py-3 rounded-2xl bg-brand text-brand-contrast hover:bg-brand-hover transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "COPIED" : "COPY ADDRESS"}
            </button>

            {governance.address && (
              <a
                href={addressLink(contractAddr)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 font-display font-extrabold text-xs uppercase px-4 py-3 rounded-2xl border border-border bg-surface hover:border-brand text-muted hover:text-ink transition-colors"
                title="View on Monad Explorer"
              >
                EXPLORER <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
