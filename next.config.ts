import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP second — Next picks per-browser and falls back to the
    // original. All site imagery is local, so no remotePatterns are needed.
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints the layouts actually switch at, so the optimiser
    // is not generating variants nothing ever requests.
    deviceSizes: [390, 640, 828, 1080, 1280, 1512, 1920, 2400],
  },

  async headers() {
    return [
      // NOTE: no rule for /_next/static — Next.js already serves fingerprinted
      // build assets as `immutable` in production, and overriding the header
      // here leaks into `next dev`, where it breaks hot reloading.
      {
        // Media is large and rarely changes; a long TTL with revalidation keeps
        // repeat visits cheap without stranding a replaced file.
        source: "/:dir(video|images)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
