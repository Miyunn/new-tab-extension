import { z } from "zod";

export const SearchSchema = z.object({
  searchBar: z.boolean().default(true),
  searchEngine: z.string().default("google"),
  searchBarWidth: z.number().min(125).max(1000).default(300),
  customSearchEngineUrl: z.string().default(""),
});

export const SearchSettingsUI = {
  searchBar: {
    label: "Show Search bar",
    control: "checkbox",
  },
  searchEngine: {
    label: "Search Engine",
    options: [
      { value: "google", label: "Google" },
      { value: "bing", label: "Bing" },
      { value: "duckduckgo", label: "DuckDuckGo" },
      { value: "custom", label: "Custom" },
    ],
  },
  searchBarWidth: {
    label: "Search Bar Width",
    control: "range",
    min: 125,
    max: 1000,
    step: 5,
    labels: ["125px", "500px", "1000px"],
  },
};
