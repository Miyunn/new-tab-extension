import { Settings } from "../../types/settings";
import AppVersion from "./components/app-version";
import BackupAndRestore from "./components/backup-restore-settings";
import IconBackgroundSettings from "./components/icon-background-settings";
import IconSettings from "./components/icon-settings";
import SearchbarSettings from "./components/searchbar-settings";
import WallpaperSettings from "./components/wallpaper-settings";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";

export type ChangeLike =
  | ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | {
    target: {
      name: keyof Settings;
      value: string | number | boolean;
    };
  };

export type HandleChange = (e: ChangeLike) => void;

interface SettingsMenuProps {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  forceUnsplashFetch: () => void;
}

export default function SettingsMenu({
  setSettings,
  settings,
  forceUnsplashFetch,
}: SettingsMenuProps) {
  const handleChange: HandleChange = (e) => {
    const { name, value } =
      "target" in e
        ? e.target // either ChangeEvent or custom object
        : { name: "", value: "" }; // fallback (TypeScript happy)

    let newValue = value;

    if ("type" in e.target) {
      const type = e.target.type;
      if (type === "checkbox" && e.target instanceof HTMLInputElement) {
        newValue = e.target.checked;
      } else if (type === "range") {
        newValue = parseFloat(value as string);
      }
    }

    setSettings((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
      localStorage.setItem("settings", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <WallpaperSettings
        settings={settings}
        handleChange={handleChange}
        forceUnsplashFetch={forceUnsplashFetch}
        setSettings={setSettings}
      />
      <IconSettings settings={settings} handleChange={handleChange} />
      <IconBackgroundSettings settings={settings} handleChange={handleChange} />
      <SearchbarSettings settings={settings} handleChange={handleChange} />
      <BackupAndRestore />
      <AppVersion />
    </>
  );
}
