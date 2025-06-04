import AppVersion from "./components/app-version";
import BackupAndRestore from "./components/backup-restore-settings";
import IconBackgroundSettings from "./components/icon-background-settings";
import IconSettings from "./components/icon-settings";
import SearchbarSettings from "./components/searchbar-settings";
import WallpaperSettings from "./components/wallpaper-settings";

export default function SettingsMenu({
  setSettings,
  settings,
}: {
  setSettings: [] | any;
  settings: [] | any;
}) {
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

    const updatedSettings = {
      ...settings,
      [name]: newValue,
    };
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  return (
    <>
      <WallpaperSettings settings={settings} handleChange={handleChange} />
      <IconSettings settings={settings} handleChange={handleChange} />
      <IconBackgroundSettings settings={settings} handleChange={handleChange} />
      <SearchbarSettings settings={settings} handleChange={handleChange} />
      <BackupAndRestore />
      <AppVersion />
    </>
  );
}
