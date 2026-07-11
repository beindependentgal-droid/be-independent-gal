import { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/academy",
  "/blog",
  "/challenges",
  "/circles",
  "/community",
  "/contact",
  "/events",
  "/fund",
  "/get-involved",
  "/join",
  "/privacy",
  "/programs",
  "/terms",
  "/signin",
  "/auth/sign-up",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://big.org${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
