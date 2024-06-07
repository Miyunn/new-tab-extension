import { useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";

function App() {
  const [settings, setSettings] = useState(() => {
    const localValue = localStorage.getItem("settings");
    if (localValue == null) {
      const defaultSettings = {
        searchEngine: "google",
        background: "dark",
      };
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(localValue);
  });

  return (
    <>
      <Searchbar searchEngine={settings.searchEngine} />
    </>
  );
}

export default App;
