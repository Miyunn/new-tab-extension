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
const UnsplashCredits = lazy(() => import("./components/unsplash-credits"));

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
  const [unsplashImage, setUnsplashImage] = useState<{
    imageUrl: string;
    timestamp: number;
    artist: string;
    profilePic: string;
    artistLink: string;
    imageLink: string;
    type: string;
  } | null>(null);

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

  const ONE_HOUR = 60 * 60 * 100;

  const fetchUnsplashImage = async () => {
    const unsplashData = JSON.parse(
      localStorage.getItem("unsplashData") || "{}",
    );
    const currentTime = new Date().getTime();

    // Check if we have valid cached data within the one-hour limit
    if (
      unsplashData.imageUrl &&
      currentTime - unsplashData.timestamp < ONE_HOUR
    ) {
      setUnsplashImage(unsplashData);
      console.log("Using cached Unsplash image");
      return;
    } // Fetch a new image if no valid cache is found
    try {
      const response = await fetch(
        `https://newtab-backend-proxy.vercel.app/api/getUnsplashImage?query=nature`,
      );
      const data = await response.json();
      console.log(data);

      const newImageData = {
        imageUrl: data.urls.regular,
        timestamp: currentTime,
        artist: data.user.name,
        profilePic: data.user.profile_image.small,
        type: data.asset_type,
        artistLink: data.user.links.html,
        imageLink: data.links.html,
      };

      // Update localStorage with the new image and current timestamp
      localStorage.setItem("unsplashData", JSON.stringify(newImageData));

      // Update the state with the new image data
      setUnsplashImage(newImageData);
      console.log("Unsplash image fetched successfully");
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    }
  };

  useEffect(() => {
    if (settings.backgroundType === "unsplash") {
      fetchUnsplashImage();
    }
  }, [settings.backgroundType]);
  let bg = {};

  if (settings.backgroundType === "image" && wallpaperData) {
    bg = {
      backgroundImage: `url(${wallpaperData})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: `blur(${settings.blurValue}px)`,
      transform: "scale(1.04)",
    };
  } else if (settings.backgroundType === "url") {
    bg = {
      backgroundImage: `url(${settings.backgroundUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: `blur(${settings.blurValue}px)`,
      transform: "scale(1.04)",
    };
  } else if (settings.backgroundType === "unsplash" && unsplashImage) {
    bg = {
      backgroundImage: `url(${unsplashImage.imageUrl})`,
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
          settings.backgroundType === "url" ||
          settings.backgroundType === "unsplash") && (
            <div
              style={{
                backgroundColor: "black",
                opacity: `${settings.backgroundTintIntensity}`,
              }}
              className="absolute inset-0"
            />
          )}
      </div>

      {settings.backgroundType === "unsplash" && (
        <div className="absolute bottom-0 right-0 z-50">
          <UnsplashCredits
            imageUrl={unsplashImage?.imageUrl || ""}
            type={unsplashImage?.type || ""}
            artist={unsplashImage?.artist || ""}
            profilePic={unsplashImage?.profilePic || ""}
            artistLink={unsplashImage?.artistLink || ""}
            imageLink={unsplashImage?.imageLink || ""}
          />
        </div>
      )}
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
