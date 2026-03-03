const BASE_URL = "https://streamwavetv.online";

// 🔥 Major countries only (ISO uppercase)
const MAJOR_COUNTRIES = [
  "US",
  "IN",
  "GB",
  "CA",
  "AU",
  "DE",
  "JP",
  "FR",
  "BR",
  "SG",
];

export default async function sitemap() {
  // Fetch channels (replace with your actual source)
  const res = await fetch("https://your-api.com/channels", {
    cache: "no-store",
  });

  const channels = await res.json();

  // 🌍 Region URLs
  const regionUrls = MAJOR_COUNTRIES.map((code) => ({
    url: `${BASE_URL}/region/${code}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 📺 Channel URLs
  const channelUrls = channels.map((channel) => ({
    url: `${BASE_URL}/channel/${channel.slug}`,
    lastModified: new Date(channel.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...regionUrls,
    ...channelUrls,
  ];
}