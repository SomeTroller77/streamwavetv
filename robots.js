export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/search",
          "/play/",
        ],
      },
    ],
    sitemap: "https://streamwavetv.online/sitemap.xml",
  };
}