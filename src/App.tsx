import { useEffect, useState, lazy, Suspense, MouseEvent } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grid";
import { Drawer } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./database/indexDb";
import NoIconOptions from "./components/no-icons-options";
import { defaultSettings } from "./database/defaultSettings";
import { IconData } from "./types/iconData";

const ChangeSettings = lazy(
  () => import("./components/settings-drawer-content"),
);
const AddIconForm = lazy(() => import("./components/add-icon-modal-content"));

export default function App() {
  const [settings, setSettings] = useState(() => {
    const localValue = localStorage.getItem("settings");
    if (localValue == null) {
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(localValue);
  });

  const [loading, setLoading] = useState(true);
  const [iconData, setIconData] = useState<IconData[]>([]);

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
    if (icons !== undefined) {
      setIconData(icons);
    }
  }, [icons]);

  const wallpaperTable = db.table("wallpaper");
  const wallpaperData = useLiveQuery(async () => {
    const result = await wallpaperTable.where("id").equals(1).toArray();
    return result.map((item) => item.data);
  }, []);

  const disableRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  let bg = {};

  if (
    settings.backgroundType === "image" ||
    settings.backgroundType === "url"
  ) {
    bg = {
      backgroundImage:
        settings.backgroundType === "image"
          ? `url(${wallpaperData})`
          : `url(${settings.backgroundUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: `blur(${settings.blurValue}px)`,
      transform: "scale(1.04)",
    };
  } else if (settings.backgroundType === "dark") {
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
  } else {
    bg = {
      backgroundColor: settings.backgroundColor,
    };
  }

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
    <div
      className="antialiased overflow-hidden relative"
      onContextMenu={disableRightClick}
    >
      <div style={bg} className="absolute inset-0 fade-in">
        {(settings.backgroundType === "image" ||
          settings.backgroundType === "url") && (
          <div
            style={{
              backgroundColor: "black",
              opacity: `${settings.backgroundTintIntensity}`,
            }}
            className="absolute inset-0"
          />
        )}
      </div>
      <div className="relative z-10 fade-in">
        <div className="flex flex-col justify-center items-center h-screen">
          {settings.searchBar && (
            <Searchbar
              searchEngine={settings.searchEngine}
              searchBarWidth={settings.searchBarWidth}
            />
          )}
          {settings.iconVisibility &&
            (iconData.length === 0 ? (
              <NoIconOptions showAddIconDrawer={showAddIcons} />
            ) : settings.layoutStyle === "grid" ? (
              <IconGrid
                iconData={icons as IconData[]}
                heightWidth={settings.iconSize}
                labels={settings.iconLabel}
                columns={settings.iconColumns}
                gap={settings.iconGap}
                setIconData={setIconData}
                sortType={settings.iconOrder}
                iconBackground={settings.iconBackground}
                iconBackgroundColor={settings.iconBackgroundColor}
                iconBackgroundOpacity={settings.iconBackgroundOpacity}
                iconBackgroundRadius={settings.iconBackgroundRadius}
              />
            ) : null)}
        </div>
        <Drawer
          placement="right"
          onClose={onCloseSettings}
          open={openSettings}
          closable={false}
          width={400}
          className="custom-drawer"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <ChangeSettings
              setSettings={setSettings}
              settings={settings}
              closeDrawer={onCloseSettings}
            />
          </Suspense>
        </Drawer>

        <Drawer
          placement="top"
          onClose={onCloseShowIcons}
          open={openAddIcon}
          closable={false}
          height={540}
          className="custom-drawer"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <AddIconForm closeDrawer={onCloseShowIcons} />
          </Suspense>
        </Drawer>

        <ControlIcons
          showDrawer={showSettings}
          showAddIconDrawer={showAddIcons}
        />
      </div>
    </div>
  );
}
