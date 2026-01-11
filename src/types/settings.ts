import { z } from "zod";
import { SettingsSchema } from "../components/schemas/settings.schema";

export type Settings = z.output<typeof SettingsSchema>;
export type SettingsInput = z.input<typeof SettingsSchema>;
