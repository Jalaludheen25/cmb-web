"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { navigation, services, site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    // Reveal on any upward intent; hide only once clear of the hero.
    setHidden(latest > previous && latest > 420 && !open);
  });

  // Close the overlay on route change. Adjusting during render (rather than in
  // an effect) means the overlay is never committed to the screen for a frame
  // on top of the page it was navigating away from.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Lock the page behind the overlay and support Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // `inert` on everything behind the overlay. Hiding the page visually is not
    // enough — without this, keyboard and screen-reader users tab straight past
    // the menu into the footer links sitting underneath it. The header is left
    // alone deliberately, because it owns the close button.
    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter((node): node is HTMLElement => node !== null);
    behind.forEach((node) => node.setAttribute("inert", ""));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      behind.forEach((node) => node.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brass focus:px-5 focus:py-3 focus:font-mono focus:text-[0.6875rem] focus:uppercase focus:tracking-[0.18em] focus:text-ink"
      >
        Skip to content
      </a>

      <motion.header
        animate={{ y: hidden ? "-105%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !open
            ? "border-b border-ink-line/80 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="text-sand transition-opacity hover:opacity-70"
            data-cursor="link"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {navigation.map((item) => {
              // Hash links point back into the home page, so they never own an
              // "active" state of their own.
              const active =
                !item.href.includes("#") && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="link"
                  className={cn(
                    "link-wipe font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
                    active ? "text-brass-hi" : "text-sand hover:text-brass-hi",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${site.contact.phoneHref}`}
              data-cursor="link"
              className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-sand-dim transition-colors hover:text-brass-hi xl:block"
            >
              {site.contact.phone}
            </a>

            <span className="hidden sm:block">
              <Button href="/contact" size="sm">
                Request a rate
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              data-cursor="link"
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-ink-line text-sand transition-colors hover:border-brass hover:text-brass-hi lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    open ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    open ? "top-1/2 -rotate-45" : "top-full",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MenuOverlay onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const links = [{ label: "Home", href: "/" }, ...navigation];

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      // Lenis swallows wheel events document-wide. Without this the overlay's
      // own scroll container is dead on a trackpad — the menu is taller than a
      // phone viewport, so that would strand the contact details at the bottom.
      data-lenis-prevent
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      // Must sit BELOW the header (z-50). The header is transformed for its
      // hide-on-scroll animation, which makes it a stacking context — so the
      // close button's own z-index cannot lift it above a higher overlay. Paint
      // the overlay underneath instead, and the logo and close button stay
      // reachable. Getting this wrong traps phone users in the menu: there is
      // no visible close control and no Escape key on a handset.
      className="fixed inset-0 z-40 overflow-y-auto bg-ink lg:hidden"
    >
      <div className="grain-layer" />

      <div className="shell relative z-10 flex min-h-dvh flex-col pt-28 pb-14">
        <nav aria-label="Mobile" className="flex flex-col">
          {links.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-ink-line"
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 py-5 text-d3 optic-wide text-sand transition-colors hover:text-brass-hi"
              >
                {/* Decorative counter — aria-hidden so the link is announced as
                    "About", not "03 About". */}
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.625rem] tracking-[0.2em] text-sand-mute"
                >
                  0{i + 1}
                </span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <p className="eyebrow text-sand-mute">Services</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onClick={onClose}
                  className="block py-1 text-sm text-sand-dim transition-colors hover:text-brass-hi"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62, duration: 0.7 }}
          className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm"
        >
          <Image
            src="/images/uae/dubai-night.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="media-scrim absolute inset-0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-auto pt-10"
        >
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="block font-display text-2xl text-sand transition-colors hover:text-brass-hi"
          >
            {site.contact.phone}
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-2 block text-sm text-sand-dim transition-colors hover:text-brass-hi"
          >
            {site.contact.email}
          </a>
          <p className="mt-4 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-sand-mute">
            {site.contact.address.line1}
            <br />
            {site.contact.address.city}, {site.contact.address.country}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
