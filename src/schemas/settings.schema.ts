import { z } from "zod";
import { WallpaperSchema } from "./wallpaper.schema";
import { IconSchema } from "./icon.schema";
import { SearchSchema } from "./search.schema";

export const SettingsSchema = z.object({
  ...WallpaperSchema.shape,
  ...SearchSchema.shape,
  ...IconSchema.shape,
});
