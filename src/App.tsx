import { useEffect, useState, lazy, Suspense, MouseEvent } from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ControlIcons from "./components/control-icons";
import IconGrid from "./layouts/icon-grid";
import { Drawer } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import db from "./database/indexDb";
import NoIconOptions from "./components/no-icons-options";
import { IconData } from "./types/iconData";
import { chromeDefaultSettings } from "./database/chrome-defaultSettings";
import { firefoxDefaultSettings } from "./database/firefox-defaultSettings";
const UnsplashCredits = lazy(() => import("./components/unsplash-credits"));
const SettingsMenu = lazy(() => import("./components/settings"));
const AddIconForm = lazy(() => import("./components/add-icon-modal-content"));

export default function App() {
  const [settings, setSettings] = useState(() => {
    const localSettings = localStorage.getItem("settings");

    if (localSettings !== null) {
      return JSON.parse(localSettings);
    }

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    const defaultSettings = isFirefox
      ? firefoxDefaultSettings
      : chromeDefaultSettings;

    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  });

  const [loading, setLoading] = useState(true);
  const [iconData, setIconData] = useState<IconData[]>([]);

  const [unsplashImage, setUnsplashImage] = useState(() => {
    const localUnsplashImage = localStorage.getItem("unsplashData");

    if (localUnsplashImage !== null) return JSON.parse(localUnsplashImage);
  });

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

  const fetchUnsplashImage = async (): Promise<void> => {
    const query = settings.unsplashQuery;
    try {
      const response = await fetch(
        `https://newtab-backend-proxy.vercel.app/api/getUnsplashImage?query=${query}`,
      );

      const currentTime = new Date().getTime();

      const data = await response.json();
      const newImageData = {
        imageUrls: [
          data.urls.small,
          data.urls.regular,
          data.urls.full,
          data.urls.raw,
        ],
        blurhash: data.blur_hash,
        timestamp: currentTime,
        artist: data.user.name,
        profilePic: data.user.profile_image.medium,
        type: data.asset_type,
        artistLink: data.user.links.html,
        imageLink: data.links.html,
        downloadLink: data.links.download,
      };
      localStorage.setItem("unsplashData", JSON.stringify(newImageData));
      setUnsplashImage(newImageData);
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    }
  };

  const startBackgroundFetch = (cacheDuration: number) => {
    const fetchUnsplashImageBackground = async () => {
      const unsplashData = unsplashImage;
      const currentTime = new Date().getTime();

      // Immediately display the cached wallpaper
      if (unsplashData && unsplashData.imageUrls) {
        setUnsplashImage(unsplashData); // Display the old image
      }

      if (
        unsplashData &&
        unsplashData.timestamp &&
        currentTime - unsplashData.timestamp < cacheDuration
      ) {
        return;
      }
      fetchUnsplashImage();
    };
    fetchUnsplashImageBackground();
  };

  useEffect(() => {
    if (
      settings.backgroundType === "unsplash" &&
      settings.unsplashAutoRefresh
    ) {
      const refreshRate = Math.max(settings.unsplashFrequency, 1);
      const refresh_frequency = refreshRate * 60 * 60 * 1000;
      startBackgroundFetch(refresh_frequency);
    }
  }, [settings.backgroundType, settings.unsplashAutoRefresh]);

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
  } else if (settings.backgroundType === "unsplash") {
    const unsplashData = JSON.parse(
      localStorage.getItem("unsplashData") || "null",
    );
    if (unsplashData !== null) {
      const qualityIndex =
        settings.unsplashQuality >= 0 && settings.unsplashQuality <= 3
          ? settings.unsplashQuality
          : 1; // Default quality is medium
      const selectedImageUrl = unsplashData.imageUrls[qualityIndex];
      bg = {
        backgroundImage: `url(${selectedImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: `blur(${settings.blurValue}px)`,
        transform: "scale(1.04)",
      };
    }
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
      <div style={bg} className="absolute inset-1 fade-in">
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
      {settings.backgroundType === "unsplash" && unsplashImage?.artistLink && (
        <div className="absolute bottom-0 left-0 z-50 fade-in">
          <UnsplashCredits
            type={unsplashImage?.type || ""}
            artist={unsplashImage?.artist || ""}
            profilePic={unsplashImage?.profilePic || ""}
            artistLink={unsplashImage.artistLink}
            imageLink={unsplashImage?.imageLink || ""}
            downloadLink={unsplashImage?.downloadLink || ""}
          />
        </div>
      )}
      <div className="relative z-10 fade-in">
        <div className="flex flex-col justify-center items-center h-screen">
          {settings.searchBar && (
            <Searchbar
              searchEngine={settings.searchEngine}
              searchBarWidth={settings.searchBarWidth}
              customSearchEngineUrl={settings.customSearchEngineUrl}
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
                showAddIconDrawer={showAddIcons}
                hideAddIconShortcut={settings.hideAddIconShortcut}
              />
            ) : null)}
        </div>

        <Drawer
          placement="right"
          onClose={onCloseSettings}
          open={openSettings}
          closable={false}
          width={400}
          styles={{
            content: {
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(8px)",
              boxShadow: "none",
            },
            header: {
              backgroundColor: "transparent",
              borderBottom: "none",
            },
            body: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <SettingsMenu
              settings={settings}
              setSettings={setSettings}
              forceUnsplashFetch={fetchUnsplashImage}
            />
          </Suspense>
        </Drawer>

        <Drawer
          placement="right"
          onClose={onCloseShowIcons}
          open={openAddIcon}
          closable={false}
          height={590}
          styles={{
            content: {
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(8px)",
              boxShadow: "none",
            },
            header: {
              backgroundColor: "transparent",
              borderBottom: "none",
            },
            body: {
              backgroundColor: "transparent",
            },
          }}
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
