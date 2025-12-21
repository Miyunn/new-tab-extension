import { Settings } from "../../types/settings";
import AppVersion from "./components/app-version";
import BackupAndRestore from "./components/backup-restore-settings";
import IconBackgroundSettings from "./components/icon-background-settings";
import IconSettings from "./components/icon-settings";
import SearchbarSettings from "./components/searchbar-settings";
import WallpaperSettings from "./components/wallpaper-settings";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";

export type HandleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
) => void;

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const { name, type, value } = target;

    let newValue: string | boolean | number;

    if (type === "checkbox" && target instanceof HTMLInputElement) {
      newValue = target.checked;
    } else if (type === "range") {
      newValue = parseFloat(value);
    } else {
      newValue = value;
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
