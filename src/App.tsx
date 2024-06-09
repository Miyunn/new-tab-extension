import { useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settings-modal";
import ControlIcons from "./components/control-icons";

export default function App() {
  const [settings, setSettings] = useState(() => {
    const localValue = localStorage.getItem("settings");
    if (localValue == null) {
      const defaultSettings = {
        version: "0.1",
        searchBar: true,
        searchEngine: "google",
        searchBarWidth: 300,
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
      <ControlIcons />
      <div className="flex justify-center items-center h-screen ">
        <div>
          {settings.searchBar && (
            <Searchbar
              searchEngine={settings.searchEngine}
              searchBarWidth={settings.searchBarWidth}
            />
          )}
          <ChangeSettings setSettings={setSettings} settings={settings} />
        </div>
      </div>
    </div>
  );
}
