import { useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settings-drawer-content";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grind";
import { Drawer } from "antd";
import AddIconForm from "./components/add-icon-modal-content";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./database/indexDb";

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

  // Fetching Icon data from here
  // useLiveQuery is a hook that returns the result of a query as a live object.
  // The query is re-executed whenever the data it depends on changes.
  // At least that's what they say.
  const iconTable = db.table("icons");
  const iconData = useLiveQuery(() => iconTable.toArray(), []);

  const [openSettings, setOpenSettings] = useState(false);

  const showSettings = () => {
    setOpenSettings(true);
  };

  const onCloseSettings = () => {
    setOpenSettings(false);
  };

  const [openAddIcon, setOpenAddIcon] = useState(false);

  const showAddIcons = () => {
    setOpenAddIcon(true);
  };

  const onCloseShowIcons = () => {
    setOpenAddIcon(false);
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
        onClose={onCloseSettings}
        open={openSettings}
        closable={false}
        width={400}
        className="custom-drawer"
      >
        <ChangeSettings setSettings={setSettings} settings={settings} />
      </Drawer>

      <Drawer
        placement="top"
        onClose={onCloseShowIcons}
        open={openAddIcon}
        closable={false}
        height={530}
        className="custom-drawer"
      >
        <AddIconForm />
      </Drawer>

      <ControlIcons showDrawer={showSettings} showAddIconModal={showAddIcons} />
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
              iconData={iconData}
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
