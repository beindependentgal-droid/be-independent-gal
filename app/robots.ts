import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/profile/", "/dashboard/"],
    },
    sitemap: "https://big.org/sitemap.xml",
  };
}
