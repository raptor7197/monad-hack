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
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  cardClassName,
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

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current ? container.current.querySelector(".sticky-cards") : ".sticky-cards",
          start: "top top",
          end: () => `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
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
            scale: 0.75,
            rotation: (i % 2 === 0 ? 4 : -4),
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
    <div className={cn("relative h-screen w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-4 lg:p-8">
        <div
          className={cn(
            "relative h-[85vh] w-full max-w-sm overflow-hidden rounded-3xl sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl shadow-2xl",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              className={cn(
                "absolute inset-0 h-full w-full rounded-3xl overflow-hidden border-2 border-border shadow-2xl flex flex-col justify-between p-6 sm:p-10 md:p-12",
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
                  className="absolute inset-0 h-full w-full object-cover -z-10 opacity-30"
                />
              )}

              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <span className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-brand px-3 py-1 rounded-full bg-brand/15 border border-brand/30">
                  {card.tag || `PILLAR 0${i + 1}`}
                </span>
                <span className="font-mono text-xs sm:text-sm text-muted">
                  0{i + 1} / 0{cards.length}
                </span>
              </div>

              {/* Card body */}
              <div className="my-auto py-6">
                {card.subtitle && (
                  <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                    {card.subtitle}
                  </p>
                )}
                <h3
                  className="font-display font-extrabold uppercase leading-[0.92] tracking-tight text-ink"
                  style={{ fontSize: "clamp(26px, 4.5vw, 56px)" }}
                >
                  {card.title}
                </h3>
                <p className="mt-4 text-muted text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                  {card.description}
                </p>

                {card.content}
              </div>

              {/* Card bottom metric */}
              <div className="flex items-center justify-between border-t border-border/80 pt-4 font-mono text-xs text-muted">
                {card.metric ? (
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-brand">
                      {card.metric}
                    </span>
                    <span className="text-[11px] sm:text-xs uppercase">{card.metricLabel}</span>
                  </div>
                ) : (
                  <span>FlipGuard Monad Architecture</span>
                )}
                <span className="text-safe flex items-center gap-1.5">
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
