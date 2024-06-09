import { useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settings-modal";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grind";

export default function App() {
  const [settings, setSettings] = useState(() => {
    const localValue = localStorage.getItem("settings");
    if (localValue == null) {
      const defaultSettings = {
        version: "0.1",
        searchBar: true,
        searchEngine: "google",
        searchBarWidth: 300,
        iconVisibility: true,
        layoutStyle: "grid",
        iconLabel: true,
        iconSize: 50,
        iconColumns: 5,
        iconGap: 20,
      };
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(localValue);
  });

  return (
    <div
      style={{
        backgroundColor: "#120312",
        backgroundImage:
          "linear-gradient(296deg, #120312 1%, #020e18 50%, #0f0414 97%)",
      }}
      className="antialiased overflow-hidden"
    >
      {/* TODO: orgnaize the code here*/}
      <ControlIcons />
      <div className="flex flex-col justify-center items-center h-screen ">
        {settings.searchBar && (
          <Searchbar
            searchEngine={settings.searchEngine}
            searchBarWidth={settings.searchBarWidth}
          />
        )}
        {settings.iconVisibility &&
          (settings.layoutStyle === "grid" ? (
            <IconGrid heightWidth={settings.iconSize} labels={settings.iconLabel} columns={settings.iconColumns} gap={settings.iconGap} />
          ) : null)}
        <ChangeSettings setSettings={setSettings} settings={settings} />
      </div>
    </div>
  );
}
