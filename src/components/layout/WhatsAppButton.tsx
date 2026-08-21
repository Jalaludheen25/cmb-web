"use client";

import { site } from "@/lib/content";

/**
 * Floating WhatsApp contact button, present on every page via the root layout.
 *
 * Deliberately in WhatsApp's own green rather than the site palette. Everything
 * else here is brass and ink, and it was tempting to make this match — but this
 * is a functional affordance, not decoration. People scan for the green circle;
 * a tasteful brass one would disappear into the design and stop being found,
 * which defeats the point of putting it on every page.
 *
 * Stacking: z-30 keeps it above page content but *below* the mobile menu
 * overlay (z-40) and the video lightbox (z-80), so it correctly hides behind
 * both rather than floating on top of a modal.
 */
export function WhatsAppButton() {
  const message = encodeURIComponent(
    `Hello ${site.name} — I would like a quote. Commodity, route and dates below:`,
  );
  const href = `https://wa.me/${site.contact.whatsappHref}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={`Message ${site.name} on WhatsApp at ${site.contact.whatsapp}`}
      // Marks it as page-level chrome that must go inert behind the mobile menu.
      data-whatsapp-fab
      className="group/wa fixed bottom-5 right-5 z-30 flex items-center gap-0 sm:bottom-7 sm:right-7"
    >
      {/* Label slides out from behind the disc on hover. Pointer-only: it is
          hidden below sm, where there is no hover and less room. */}
      <span
        aria-hidden="true"
        className="pointer-events-none mr-[-1.25rem] hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-ink-soft/95 py-3 pl-5 pr-8 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-sand opacity-0 shadow-lg ring-1 ring-ink-line backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wa:max-w-[16rem] group-hover/wa:opacity-100 sm:block"
      >
        Chat on WhatsApp
      </span>

      <span
        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full shadow-xl ring-1 ring-black/20 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wa:scale-105 group-focus-visible/wa:scale-105"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* An expanding outline rather than a filled halo — noticed without
            demanding attention, and it does not bloom over nearby content. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 motion-safe:animate-[whatsapp-halo_3.4s_ease-out_infinite]"
          style={{ borderColor: "#25D366" }}
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="relative h-7 w-7 fill-white"
        >
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23z" />
        </svg>
      </span>
    </a>
  );
}
