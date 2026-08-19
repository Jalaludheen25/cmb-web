"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

/**
 * Showreel.
 *
 * The section itself plays a silent, looping ambient cut. Clicking the plate
 * opens the full piece with sound in a dialog — audio never starts without a
 * deliberate action, which is the only acceptable way to ship a video section.
 */
export function Showreel() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="relative isolate" aria-labelledby="showreel-heading">
      <div className="shell bay">
        <div className="relative overflow-hidden rounded-sm">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]">
            <BackgroundVideo
              src="/video/showreel-sea.mp4"
              mobileSrc="/video/showreel-sea-mobile.mp4"
              poster="/video/showreel-sea-poster.jpg"
              overlayClassName="bg-ink/45"
            />

            <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-10 lg:p-14">
              <Reveal>
                <p className="eyebrow flex items-center gap-3 text-sand">
                  <span aria-hidden="true" className="inline-block h-px w-8 bg-brass" />
                  Showreel · 00:14
                </p>
              </Reveal>

              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <RevealText
                    as="h2"
                    lines={["Ninety seconds", "on the water."]}
                    className="max-w-[16ch] text-d2 optic-wide text-sand"
                  />
                  <span id="showreel-heading" className="sr-only">
                    CMB Cargo showreel
                  </span>
                  <Reveal delay={0.15}>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-sand-soft">
                      A look at how a booking becomes a berth, a customs entry and a delivery
                      note — filmed across our Jebel Ali operation.
                    </p>
                  </Reveal>
                </div>

                <Reveal delay={0.2}>
                  <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setOpen(true)}
                    data-cursor="link"
                    className="group/play flex shrink-0 items-center gap-4"
                    aria-label="Play the CMB Cargo showreel with sound"
                  >
                    <span className="relative grid h-20 w-20 place-items-center rounded-full border border-sand/40 transition-colors duration-500 group-hover/play:border-brass lg:h-24 lg:w-24">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 scale-0 rounded-full bg-brass transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/play:scale-100"
                      />
                      <svg
                        viewBox="0 0 16 18"
                        aria-hidden="true"
                        className="relative ml-1 h-5 w-5 fill-sand transition-colors duration-400 group-hover/play:fill-ink"
                      >
                        <path d="M0 0v18l16-9z" />
                      </svg>
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-sand transition-colors group-hover/play:text-brass-hi">
                      Watch
                    </span>
                  </button>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Lightbox
            onClose={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Minimal focus trap: only the close button and the video are focusable.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, video[controls], [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  // Portalled to <body>. This section is `isolate`, which creates a stacking
  // context — inside it, `z-[80]` is only ever 80 *within the section*, so the
  // sections that follow in the DOM painted straight over the backdrop and the
  // page showed through the "modal". A portal is the only reliable fix; raising
  // the z-index does nothing.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="CMB Cargo showreel"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className="relative w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-sm border border-ink-line bg-ink"
        >
          <video
            src="/video/showreel-sea.mp4"
            poster="/video/showreel-sea-poster.jpg"
            controls
            autoPlay
            playsInline
            className="aspect-video w-full bg-ink"
          />
        </motion.div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-ink-line text-sand transition-colors hover:border-brass hover:text-brass-hi sm:-top-14"
          aria-label="Close video"
        >
          <svg viewBox="0 0 14 14" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}
