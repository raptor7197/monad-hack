/* eslint-disable @next/next/no-img-element */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CardData {
  id: number | string;
  image?: string;
  alt?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  metric?: string;
  metricLabel?: string;
  content?: ReactNode;
}

export interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  cardClassName,
  headerTitle = "5 PILLARS OF FLIPGUARD",
  headerSubtitle = "CONTINUOUS SCROLLING DEFENSE STACK",
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = cardRefs.current;
      const totalCards = cardElements.length;

      if (!cardElements[0]) return;

      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!cardElements[i]) continue;
        gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const stickyEl = container.current?.querySelector(".sticky-cards");
      if (!stickyEl) return;

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyEl,
          start: "top 88px",
          end: () => `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;
        if (!currentCard || !nextCard) continue;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.85,
            rotation: i % 2 === 0 ? 3 : -3,
            opacity: 0.8,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div className="sticky-cards relative flex min-h-screen h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8 bg-bg">
        {/* Pinned Title Header (stays in place as cards scroll continuously) */}
        <div className="mb-4 text-center shrink-0">
          <p className="font-mono text-xs uppercase text-brand tracking-widest">
            {headerSubtitle}
          </p>
          <h2
            className="font-display font-extrabold uppercase leading-none tracking-[-0.04em] text-ink mt-1"
            style={{ fontSize: "clamp(24px, 4vw, 54px)" }}
          >
            {headerTitle}
          </h2>
        </div>

        {/* Card Stacking Container */}
        <div
          className={cn(
            "relative h-[68vh] sm:h-[72vh] md:h-[74vh] w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl shadow-2xl",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              style={{ zIndex: i + 1 }}
              className={cn(
                "absolute inset-0 h-full w-full rounded-3xl overflow-hidden border-2 border-border shadow-2xl flex flex-col justify-between p-6 sm:p-8 md:p-10",
                i % 2 === 0 ? "bg-surface-2" : "bg-surface-3",
                cardClassName,
              )}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.alt || ""}
                  className="absolute inset-0 h-full w-full object-cover -z-10 opacity-25"
                />
              )}

              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="font-display font-extrabold text-xs uppercase tracking-wider text-brand px-3 py-1 rounded-full bg-brand/15 border border-brand/30">
                  {card.tag || `PILLAR 0${i + 1}`}
                </span>
                <span className="font-mono text-xs text-muted">
                  0{i + 1} / 0{cards.length}
                </span>
              </div>

              {/* Card body */}
              <div className="my-auto py-4">
                {card.subtitle && (
                  <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                    {card.subtitle}
                  </p>
                )}
                <h3
                  className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-ink"
                  style={{ fontSize: "clamp(22px, 3.8vw, 48px)" }}
                >
                  {card.title}
                </h3>
                <p className="mt-3 text-muted text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                  {card.description}
                </p>

                {card.content}
              </div>

              {/* Card bottom metric */}
              <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-xs text-muted">
                {card.metric ? (
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-brand">
                      {card.metric}
                    </span>
                    <span className="text-[11px] sm:text-xs uppercase">{card.metricLabel}</span>
                  </div>
                ) : (
                  <span>FlipGuard Monad Defense</span>
                )}
                <span className="text-safe flex items-center gap-1.5 text-xs font-mono">
                  <span className="h-2 w-2 rounded-full bg-safe pulse-dot" /> ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { StickyCard002 };
