"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

const steps = [
  {
    num: "1",
    title: "Snapshot voting power",
    text: "Vote weight is strictly computed from checkpointed token balances at the exact moment of proposal creation. Tokens acquired later count for zero voting weight.",
  },
  {
    num: "2",
    title: "Holding period enforcement",
    text: "Tokens transferred into a wallet within the minimum holding period window before proposal creation are disqualified. Flash loans and borrowed power cannot swing results.",
  },
  {
    num: "3",
    title: "Real-time risk registry",
    text: "Authorized decentralized monitors maintain an onchain risk registry flagging known loan-borrowers and sybil clusters. FlipGuard contracts reject flagged wallets before votes execute.",
  },
];

export function ApproachSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current?.querySelectorAll(".approach-card") || [], {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" aria-labelledby="approach-heading" className="w-full border-b border-border bg-bg py-16 md:py-24">
      <div ref={containerRef} className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs uppercase text-brand tracking-widest mb-2">Architecture</p>
          <h2
            id="approach-heading"
            className="font-display font-extrabold uppercase leading-[0.8] tracking-[-0.05em] text-ink"
            style={{ fontSize: "clamp(32px, 6vw, 84px)" }}
          >
            OUR APPROACH
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="approach-card group flex flex-col md:flex-row items-stretch rounded-3xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:border-brand"
            >
              {/* Huge Number Block */}
              <div className="flex items-center justify-center bg-surface-2 p-8 md:p-12 md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border group-hover:bg-brand/10 transition-colors">
                <span className="font-display font-extrabold text-6xl md:text-8xl text-brand leading-none">
                  {step.num}
                </span>
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center p-6 md:p-10 flex-1">
                <h3
                  className="font-display font-extrabold uppercase text-ink leading-tight"
                  style={{ fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.04em" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-muted text-sm md:text-base leading-relaxed max-w-3xl">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
