export default function sitemap() {
  const base = "https://tools.ifvest.kr";
  const lastModified = new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/stock-tax`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/isa-irp`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/overseas-stock`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/fire-calculator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
