"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function BannerSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current?.querySelectorAll(".pill-item") || [], {
        opacity: 0,
        y: 15,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full border-b border-border bg-bg py-16 md:py-24">
      <div ref={containerRef} className="mx-auto max-w-[1440px] px-6 md:px-16 text-center">
        <h2
          className="mx-auto max-w-4xl font-display font-extrabold uppercase leading-[1.05] tracking-[-0.04em] text-ink"
          style={{ fontSize: "clamp(26px, 4.5vw, 64px)" }}
        >
          Governance should be accessible, resilient, and free from flash-loan manipulation.
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {[
            "PREFLIGHT VERIFICATION",
            "ONCHAIN ENFORCEMENT",
            "SNAPSHOT POWER",
            "ZERO FLASH POWER",
            "100% TRANSPARENT",
          ].map((tag) => (
            <div
              key={tag}
              className="pill-item rounded-full border border-border bg-surface-2 px-5 py-2.5 font-display font-extrabold text-xs md:text-sm uppercase tracking-wider text-muted hover:border-brand hover:text-ink transition-colors"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
