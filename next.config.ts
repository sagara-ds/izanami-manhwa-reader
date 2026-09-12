import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/api/chapters/:id*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=600" },
        ],
      },
    ];
  },
};

export default nextConfig;
