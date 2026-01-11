import { z } from "zod";
import { SettingsSchema } from "../schemas/settings.schema";

export type Settings = z.output<typeof SettingsSchema>;
export type SettingsInput = z.input<typeof SettingsSchema>;
