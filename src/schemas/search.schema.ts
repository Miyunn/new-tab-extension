import { z } from "zod";

export const SearchSchema = z.object({
  searchBar: z.boolean().default(true),
  searchEngine: z.string().default("google"),
  searchBarWidth: z.number().min(125).max(1000).default(300),
  searchBarPlacement: z.enum(["top", "middle", "bottom"]).default("middle"),
  searchBarOffset: z.number().min(10).max(300).default(40),
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
  searchBarPlacement: {
    label: "Search Bar Placement",
    options: [
      { value: "top", label: "Top" },
      { value: "middle", label: "Middle" },
      { value: "bottom", label: "Bottom" },
    ],
  },
  searchBarOffset: {
    label: "Search Bar Offset",
    control: "range",
    min: 10,
    max: 300,
    step: 5,
    labels: ["10px", "150px", "300px"],
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
