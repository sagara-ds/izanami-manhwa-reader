import type { MetadataRoute } from "next";

const SITE_URL = "https://izanami.sagarads-portofolio.my.id";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only public landing pages. Detail/reader pages are noindex (see
  // serie/[id] + read/[chapterId] metadata) and private pages must not
  // be indexed.
  const routes = [
    "",
    "/explore",
    "/genres",
    "/popular",
    "/top",
    "/completed",
    "/updates",
    "/recommended",
    "/search",
    "/info",
    "/dmca",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
