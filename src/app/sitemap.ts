import type { MetadataRoute } from "next";

const SITE_URL = "https://izanami.sagarads-portofolio.my.id";

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/library",
    "/bookmark",
    "/history",
    "/info",
    "/login",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "hourly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
