import { z } from "zod";

export const IconSchema = z.object({
  iconVisibility: z.boolean().default(true),
  iconSize: z.number().min(30).max(100).default(50),
  iconLabel: z.boolean().default(true),
  iconColumns: z.number().min(1).max(9).default(5),
  iconGap: z.number().min(1).max(50).default(20),
  iconOrder: z.enum(["name", "position"]).default("position"),
  iconBackground: z.boolean().default(true),
  iconBackgroundColor: z.string().default("#8b8b8b"),
  iconBackgroundOpacity: z.number().min(0).max(1).default(0.17),
  iconBackgroundRadius: z.number().min(1).max(50).default(26),
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
      { value: "name", label: "Alphabetical" },
      { value: "position", label: "Manual" },
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
    labels: ["Compact", "Spacious"],
  },
  iconColumns: {
    label: "Columns",
    control: "range",
    min: 1,
    max: 9,
    step: 1,
    labels: Array.from({ length: 9 }, (_, i) => (1 + i).toString()),
  },
  iconBackground: {
    label: "Icon Background",
    control: "checkbox",
  },
  iconBackgroundOpacity: {
    label: "Icon Background Opacity",
    control: "range",
    min: 0,
    max: 1,
    step: 0.01,
    labels: ["Transparent", "Opaque"],
  },
  iconBackgroundRadius: {
    label: "Icon Shape",
    control: "range",
    min: 1,
    max: 50,
    step: 1,
    labels: ["⬜", "⚪"],
  },
  iconBackgroundColor: {
    lable: "Icon Background Color",
  },
};
