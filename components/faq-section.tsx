"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const faqs = [
  {
    q: "What is FlipGuard?",
    a: "FlipGuard is an onchain governance protection layer built for Monad. It prevents attackers from acquiring temporary, borrowed, or flash-loaned voting power right before a vote snapshot to manipulate DAO decisions.",
  },
  {
    q: "How does preflight voter assessment work?",
    a: "Before a transaction is ever broadcast to the wallet, FlipGuard simulates the assessVoter() view call on Monad Testnet RPC. If the wallet is ineligible (e.g. recent acquisition, risk flag, or zero balance), it rejects the vote immediately and explains why.",
  },
  {
    q: "Why is Monad's gas execution model important?",
    a: "Monad charges gas based on the transaction gas_limit rather than gas_used. FlipGuard optimizes gas estimation (+20% safety margin) so DAO members never overpay for preflight checks or voting executions.",
  },
  {
    q: "What triggers a RISK_FLAGGED rejection?",
    a: "FlipGuard connects to MockRiskRegistry (and future decentralized risk oracle monitors). If a wallet has been flagged for flash borrowing or sybil clustering, the FlipGuardGovernance contract reverts castVote() with Reason.RISK_FLAGGED.",
  },
  {
    q: "Can any DAO integrate FlipGuard?",
    a: "Yes. FlipGuard is designed as a modular guard layer compatible with standard OpenZeppelin Governor, GovernorBravo, and custom voting checkpoints on Monad.",
  },
];

function FaqItem({ item, isOpen, onClick }: { item: (typeof faqs)[0]; isOpen: boolean; onClick: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.fromTo(contentRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
      if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 180, duration: 0.25 });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
      if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 0, duration: 0.25 });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-border">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full py-6 md:py-8 text-left group hover:opacity-85 transition-opacity"
      >
        <span
          className="font-display font-extrabold uppercase text-ink pr-6 group-hover:text-brand transition-colors"
          style={{ fontSize: "clamp(20px, 2.5vw, 36px)", letterSpacing: "-0.03em" }}
        >
          {item.q}
        </span>

        <div
          ref={arrowRef}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="pb-8 text-muted text-sm md:text-base leading-relaxed max-w-4xl font-normal">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="w-full border-b border-border bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-16">
        <div className="mb-12 text-center md:text-left">
          <p className="font-mono text-xs uppercase text-brand tracking-widest mb-2">Answers</p>
          <h2
            id="faq-heading"
            className="font-display font-extrabold uppercase leading-[0.8] tracking-[-0.05em] text-ink"
            style={{ fontSize: "clamp(28px, 5.5vw, 80px)" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="border-t border-border">
          {faqs.map((item, idx) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIdx === idx}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
