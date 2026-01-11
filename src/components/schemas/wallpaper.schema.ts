import { z } from "zod";

export const WallpaperSchema = z.object({
  backgroundType: z
    .enum(["unsplash", "color", "image", "url"])
    .default("unsplash"),

  backgroundColor: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
    .default("#000000"),

  backgroundTintIntensity: z.number().min(0).max(1).default(0),

  blurValue: z.number().min(0).max(10).default(0),

  unsplashQuery: z.string().max(100).default(""),

  backgroundUrl: z.string().trim().max(2048).default(""),

  unsplashAutoRefresh: z.boolean().default(false),

  unsplashFrequency: z
    .union([
      z.literal(1),
      z.literal(4),
      z.literal(8),
      z.literal(12),
      z.literal(24),
    ])
    .default(24),

  unsplashQuality: z.number().int().min(0).max(3).default(1),
});

export const WallpaperUI = {
  backgroundType: {
    control: "select",
    label: "Wallpaper Source",
    options: [
      { value: "unsplash", label: "Image from Unsplash" },
      { value: "color", label: "Solid Color" },
      { value: "image", label: "Image" },
      { value: "url", label: "URL" },
    ],
  },

  backgroundTintIntensity: {
    label: "Wallpaper Tint",
    control: "range",
    min: 0,
    max: 1,
    step: 0.001,
    labels: ["No Tint", "Black"],
  },

  blurValue: {
    label: "Wallpaper Blur",
    control: "range",
    min: 0,
    max: 10,
    step: 0.01,
  },

  unsplashFrequency: {
    label: "Change Wallpaper Every",
    control: "range",
    values: [1, 4, 8, 12, 24],
    labels: ["1h", "4h", "8h", "12h", "24h"],
  },

  unsplashQuality: {
    label: "Wallpaper Quality",
    control: "range",
    min: 0,
    max: 3,
    step: 1,
    labels: ["Low", "Medium", "High", "Original"],
  },
} as const;

export type Wallpaper = z.infer<typeof WallpaperSchema>;
