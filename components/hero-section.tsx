"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Beams from "./Beams";

const tickerItems = [
  "Snapshot Power",
  "Holding Period Enforcement",
  "Risk Registry",
  "Monad Testnet 10143",
  "Zero Flash Loans",
  "Atlas Protocol DAO",
  "assessVoter() Preflight",
  "10,000 TPS Monad Speed",
  "Deterministic Defense",
];

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headingRef.current?.querySelectorAll(".hero-line") || [], {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
      })
        .from(subRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(btnsRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  return (
    <section aria-label="Hero section" className="relative w-full border-b border-border bg-bg overflow-hidden">
      {/* Interactive 3D Beams Container */}
      <div style={{ width: "100%", height: "600px", position: "relative" }} className="w-full overflow-hidden">
        <Beams
          beamWidth={2}
          beamHeight={25}
          beamNumber={39}
          lightColor="#ffffff"
          backgroundColor="#1b2d2a"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />

        {/* Hero content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16 pointer-events-auto">
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/90 backdrop-blur-md px-3 py-1 font-mono text-xs uppercase text-brand mb-6 shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" />
                Live on Monad Testnet
              </div>

              <h1
                ref={headingRef}
                className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-ink drop-shadow-md"
                style={{ fontSize: "clamp(36px, 7vw, 96px)" }}
              >
                <span className="block hero-line text-ink">STOP</span>
                <span className="block hero-line text-brand">FLASH ATTACKS</span>
                <span className="block hero-line text-ink">ON GOVERNANCE</span>
              </h1>

              <p
                ref={subRef}
                className="mt-6 max-w-2xl text-base md:text-xl text-ink/90 leading-relaxed font-normal bg-bg/40 backdrop-blur-sm rounded-xl p-2 -ml-2"
              >
                FlipGuard blocks last-minute voting power grabs before they swing a proposal. Every vote is verified
                onchain against snapshot checkpoints, holding periods, and risk signals.
              </p>

              <div ref={btnsRef} className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/proposals/1"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-brand px-6 py-3.5 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-brand-contrast hover:bg-brand-hover transition-transform hover:-translate-y-0.5 shadow-xl"
                >
                  TRY DEMO PROPOSAL
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-surface-2/90 backdrop-blur-md px-6 py-3.5 font-display font-extrabold text-sm md:text-base uppercase tracking-tight text-ink hover:border-brand hover:text-brand transition-colors"
                >
                  PROTECTION LOG
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dahl style infinite marquee ticker */}
      <div className="w-full border-t border-border bg-surface-2/80 py-3 overflow-hidden relative z-20">
        <div className="animate-marquee flex gap-6 items-center">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="font-display font-extrabold text-xs md:text-sm uppercase tracking-wider text-muted hover:text-ink transition-colors">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
