"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export function CalculatorSection() {
  const [tokensM, setTokensM] = useState(15);
  const cardRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);

  // Calculations
  const attackExposure = (tokensM * 0.45).toFixed(2); // $ millions protected
  const feeMonad = (tokensM * 0.00008).toFixed(4); // Gas cost in MON
  const savingsPct = 99.9;

  useEffect(() => {
    if (numRef.current) {
      gsap.fromTo(numRef.current, { scale: 0.96 }, { scale: 1, duration: 0.2, ease: "power1.out" });
    }
  }, [tokensM]);

  return (
    <section id="calculator" className="w-full border-b border-border bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="mb-12 text-center md:text-left">
          <p className="font-mono text-xs uppercase text-brand tracking-widest mb-2">Simulate Defense</p>
          <h2
            className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] text-ink"
            style={{ fontSize: "clamp(28px, 5vw, 68px)" }}
          >
            Calculate protected treasury
          </h2>
        </div>

        <div
          ref={cardRef}
          className="mx-auto max-w-4xl rounded-3xl border border-border bg-surface-2 p-6 md:p-12 shadow-2xl"
        >
          {/* Slider input */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="volume-slider" className="font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-ink">
                Simulated DAO Token Supply
              </label>
              <span className="font-mono text-xl md:text-2xl font-bold text-accent">
                {tokensM}M <span className="text-xs text-muted font-normal">ATLAS tokens</span>
              </span>
            </div>

            <input
              id="volume-slider"
              type="range"
              min="1"
              max="100"
              step="1"
              value={tokensM}
              onChange={(e) => setTokensM(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-3 accent-brand"
            />

            <div className="flex justify-between font-mono text-xs text-muted">
              <span>1M tokens</span>
              <span>50M tokens</span>
              <span>100M tokens</span>
            </div>
          </div>

          {/* Metrics comparison */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 border-t border-border pt-8">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-mono uppercase text-muted">Monad Verification Cost</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-safe">~{feeMonad} MON</p>
              <p className="mt-1 text-xs text-muted">Onchain preflight + gas limit check</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs font-mono uppercase text-muted">Unprotected Attack Capital Exposure</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-threat">${attackExposure}M</p>
              <p className="mt-1 text-xs text-muted">At-risk treasury if uncheckpointed</p>
            </div>
          </div>

          {/* Highlight card */}
          <div className="mt-8 rounded-2xl border border-brand/40 bg-brand/10 p-6 text-center">
            <p className="text-xs uppercase font-mono tracking-widest text-brand">Total Risk Neutralized</p>
            <p ref={numRef} className="mt-2 font-display text-4xl md:text-6xl font-extrabold text-ink">
              ${attackExposure}M <span className="text-brand text-2xl md:text-3xl">Protected</span>
            </p>
            <p className="mt-2 text-sm text-muted font-mono">{savingsPct}% flash-loan exploit reduction across proposals</p>
          </div>
        </div>
      </div>
    </section>
  );
}
