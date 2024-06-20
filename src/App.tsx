import { useEffect, useState } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ChangeSettings from "./components/settings-drawer-content";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grind";
import { Drawer } from "antd";
import AddIconForm from "./components/add-icon-modal-content";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./database/indexDb";
import NoIconOptions from "./components/no-icons-options";

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
        iconOrder: "position",
        iconSize: 50,
        iconColumns: 5,
        iconGap: 20,
        backgroundType: "dark",
        backgroundImage: "",
        backgroundColor: "#120312",
        backgroundTintIntensity: 0.5,
        blurValue: 0,
      };
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(localValue);
  });

  let bg = {};

  if (settings.backgroundType === "dark") {
    bg = {
      backgroundColor: "#120312",
      backgroundImage:
        "linear-gradient(296deg, #120312 1%, #020e18 50%, #0f0414 97%)",
    };
  } else if (settings.backgroundType === "light") {
    bg = {
      backgroundColor: "#f6def1",
      backgroundImage:
        "linear-gradient(308deg, #f6def1 0%, #cfb3e2 50%, #86cdff 100%)",
    };
  } else if (settings.backgroundType === "color") {
    bg = {
      backgroundColor: settings.backgroundColor,
    };
  } else if (settings.backgroundType === "image") {
    bg = {
      backgroundColor: "black",
      backgroundImage: `url(${settings.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: `blur(${settings.blurValue}px)`,
    };
  }

  const [loading, setLoading] = useState(true);

  // Fetching Icon data from here
  // live detects changes in the database and updates the UI
  // Updated on changes in the settings
  const iconTable = db.table("icons");
  const icons = useLiveQuery(async () => {
    const result = await iconTable
      .orderBy(settings.iconOrder || "id")
      .toArray();
    setLoading(false);
    return result;
  }, [settings]);

  useEffect(() => {
    if (icons === undefined) {
      setLoading(true);
    }
  }, [icons]);
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

  if (loading) {
    return <> </>;
  }
  return (
    <div className="antialiased overflow-hidden fade-in relative">
      <div style={bg} className="absolute inset-0">
        {settings.backgroundType === "image" && (
          <div
            style={{
              backgroundColor: "black",
              opacity: `${settings.backgroundTintIntensity}`,
            }}
            className="absolute inset-0"
          />
        )}
      </div>
      <div className="relative z-10">
        <Drawer
          placement="right"
          onClose={onCloseSettings}
          open={openSettings}
          closable={false}
          width={400}
          className="custom-drawer"
        >
          <ChangeSettings
            setSettings={setSettings}
            settings={settings}
            closeDrawer={onCloseSettings}
          />
        </Drawer>

        <Drawer
          placement="top"
          onClose={onCloseShowIcons}
          open={openAddIcon}
          closable={false}
          height={530}
          className="custom-drawer"
        >
          <AddIconForm closeDrawer={onCloseShowIcons} />
        </Drawer>

        <ControlIcons
          showDrawer={showSettings}
          showAddIconDrawer={showAddIcons}
        />
        <div className="flex flex-col justify-center items-center h-screen">
          {settings.searchBar && (
            <Searchbar
              searchEngine={settings.searchEngine}
              searchBarWidth={settings.searchBarWidth}
            />
          )}
          {settings.iconVisibility &&
            (icons === null || icons?.length === 0 ? (
              <NoIconOptions showAddIconDrawer={showAddIcons} />
            ) : settings.layoutStyle === "grid" ? (
              <IconGrid
                iconData={icons}
                heightWidth={settings.iconSize}
                labels={settings.iconLabel}
                columns={settings.iconColumns}
                gap={settings.iconGap}
              />
            ) : null)}
        </div>
      </div>
    </div>
  );
}
