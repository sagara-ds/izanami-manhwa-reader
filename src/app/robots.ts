import type { MetadataRoute } from "next";

const SITE_URL = "https://izanami.sagarads-portofolio.my.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/login", "/library", "/bookmark", "/history"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
