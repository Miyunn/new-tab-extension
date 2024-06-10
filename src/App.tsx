import { useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settings-drawer-content";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grind";
import { Drawer } from "antd";

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

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#120312",
        backgroundImage:
          "linear-gradient(296deg, #120312 1%, #020e18 50%, #0f0414 97%)",
      }}
      className="antialiased overflow-hidden"
    >
      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        closable={false}
        width={400}
        className="custom-drawer"
      >
        <ChangeSettings setSettings={setSettings} settings={settings} />
      </Drawer>

      <ControlIcons showDrawer={showDrawer} />
      <div className="flex flex-col justify-center items-center h-screen ">
        {settings.searchBar && (
          <Searchbar
            searchEngine={settings.searchEngine}
            searchBarWidth={settings.searchBarWidth}
          />
        )}
        {settings.iconVisibility &&
          (settings.layoutStyle === "grid" ? (
            <IconGrid
              heightWidth={settings.iconSize}
              labels={settings.iconLabel}
              columns={settings.iconColumns}
              gap={settings.iconGap}
            />
          ) : null)}
      </div>
    </div>
  );
}
