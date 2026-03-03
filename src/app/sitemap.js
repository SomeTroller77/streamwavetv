const BASE_URL = "https://streamwavetv.online";

const MAJOR_COUNTRIES = [
  "US",
  "IN",
  "UK",
  "CA",
  "AU",
  "DE",
  "JP",
  "FR",
  "BR",
  "SG",
];

export default function sitemap() {
  const regionUrls = MAJOR_COUNTRIES.map((code) => ({
    url: `${BASE_URL}/?region=${code}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...regionUrls,
  ];
}