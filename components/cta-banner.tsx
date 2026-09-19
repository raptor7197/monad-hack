"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

export function CtaBanner() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 4, y: -4, duration: 0.25, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 0, y: 0, duration: 0.25, ease: "power2.out" });
    }
  };

  return (
    <section aria-label="Get Started" className="w-full border-b border-border bg-surface py-12 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <Link
          ref={btnRef}
          href="/proposals/1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group flex items-center justify-center gap-6 md:gap-12 w-full rounded-full border-2 border-brand bg-brand/10 p-6 md:py-12 md:px-16 transition-all duration-300 hover:bg-brand hover:text-brand-contrast text-ink shadow-2xl"
          style={{ minHeight: "clamp(80px, 12vw, 150px)" }}
        >
          <span
            className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] transition-colors"
            style={{ fontSize: "clamp(24px, 5.5vw, 76px)" }}
          >
            PROTECT YOUR DAO
          </span>

          <div ref={arrowRef}>
            <ArrowUpRight className="h-8 w-8 md:h-16 md:w-16 shrink-0" />
          </div>
        </Link>
      </div>
    </section>
  );
}
