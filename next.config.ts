import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 is for the two estate photographs, which run full-bleed and upscaled:
    // at the default 75 the re-encode shows as blocking in the dusk gradients.
    qualities: [75, 90],
  },
};

export default nextConfig;
