import { useState } from "react";
import "./App.css";
import { FiSettings } from "react-icons/fi";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settingsModal";

export default function App() {
  const [settings, setSettings] = useState(() => {
    const localValue = localStorage.getItem("settings");
    if (localValue == null) {
      const defaultSettings = {
        searchBar: true,
        searchEngine: "google",
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
      <button
        className="fixed top-0 right-0 z-50 m-4"
        onClick={() => document.getElementById("SettingsModal").showModal()}
      >
        <FiSettings />
      </button>
      <div className="flex justify-center items-center h-screen ">
        <div>
          {settings.searchBar && (
            <Searchbar searchEngine={settings.searchEngine} />
          )}
          <ChangeSettings setSettings={setSettings} settings={settings} />
        </div>
      </div>
    </div>
  );
}

