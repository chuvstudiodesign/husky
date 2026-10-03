import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `/creative-2` was promoted to `/` (2026-10-03); its old addresses follow it.
  async redirects() {
    return [
      { source: "/creative-2", destination: "/", permanent: true },
      {
        source: "/creative-2/new-construction",
        destination: "/new-construction",
        permanent: true,
      },
    ];
  },
  // Internal tooling, out of search. Its layout is a client component and
  // cannot export `metadata`, so the header does it; the archived site
  // versions carry `robots` in their own metadata instead.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/styleguide/:path*", headers: noindex },
      { source: "/motion-check", headers: noindex },
    ];
  },
  images: {
    // 90 is for the two estate photographs, which run full-bleed and upscaled:
    // at the default 75 the re-encode shows as blocking in the dusk gradients.
    qualities: [75, 90],
  },
};

export default nextConfig;
