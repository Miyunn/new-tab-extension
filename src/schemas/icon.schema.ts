import { z } from "zod";

export const IconSchema = z.object({
  iconVisibility: z.boolean().default(true),
  iconSize: z.number().min(32).max(128).default(64),
  iconLabel: z.boolean().default(true),
  iconColumns: z.number().min(1).max(12).default(6),
  iconGap: z.number().min(0).max(32).default(12),
  iconOrder: z.string().default(""),
  iconBackground: z.boolean().default(false),
  iconBackgroundColor: z.string().default("#000000"),
  iconBackgroundOpacity: z.number().min(0).max(1).default(0.2),
  iconBackgroundRadius: z.number().min(0).max(50).default(12),
  hideAddIconShortcut: z.boolean().default(false),
});

export const IconSettingsUI = {
  iconVisibility: {
    label: "Enable Icons",
    control: "checkbox",
  },
  hideAddIconShortcut: {
    label: "Hide Add Icon Shortcut",
    control: "checkbox",
  },
  iconOrder: {
    label: "Icon Order",
    options: [
      { value: "name", label: "Name" },
      { value: "position", label: "Custom" },
    ],
  },
  iconLabels: {
    label: "Icon Names",
    control: "checkbox",
  },
  iconSize: {
    label: "Size",
    control: "range",
    min: 30,
    max: 100,
    step: 1,
    labels: ["Small", "Large"],
  },
  iconGap: {
    label: "Spacing",
    control: "range",
    min: 1,
    max: 50,
    step: 1,
    labels: ["Small", "Large"],
  },
  iconColumns: {
    label: "Columns",
    control: "range",
    min: 1,
    max: 9,
    step: 1,
    labels: Array.from({ length: 9 }, (_, i) => (1 + i).toString()),
  },
};
