import {
  useEffect,
  useState,
  lazy,
  Suspense,
  MouseEvent,
  useCallback,
} from "react";
import "./App.css";
import Searchbar from "./components/searchbar";
import ControlIcons from "./components/control-icons";
import IconGrid from "./components/icon-grid";
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
import { Settings } from "./types/settings";
import { ConfigProvider, theme } from "antd";

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => {
    const localSettings = localStorage.getItem("settings");

    if (localSettings !== null) {
      return JSON.parse(localSettings) as Settings;
    }

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    const defaultSettings = (
      isFirefox ? firefoxDefaultSettings : chromeDefaultSettings
    ) as Settings;

    localStorage.setItem(
      "settings",
      JSON.stringify(defaultSettings as Settings),
    );
    return defaultSettings;
  });

  const [loading, setLoading] = useState(true);
  const [iconData, setIconData] = useState<IconData[]>([]);

  // `localIconData` is used solely for rendering, to prevent UI changes from reflecting database updates
  // until the icon reordering logic is fully applied and stable.
  const [localIconData, setLocalIconData] = useState<IconData[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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
  }, [settings.iconOrder]);

  useEffect(() => {
    if (icons !== undefined) {
      setIconData(icons);
    }
  }, [icons]);

  useEffect(() => {
    if (!isDragging || iconData.length !== localIconData.length) {
      setLocalIconData(iconData);
    }
  }, [iconData, isDragging]);

  const wallpaperTable = db.table("wallpaper");
  const wallpaperData = useLiveQuery(async () => {
    const result = await wallpaperTable.where("id").equals(1).toArray();
    return result.map((item) => item.data);
  }, []);

  const disableRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  const fetchUnsplashImage = useCallback(async (): Promise<void> => {
    const query = settings.unsplashQuery;
    try {
      const response = await fetch(
        `https://newtab-backend-proxy.vercel.app/api/getUnsplashImage?query=${query}`,
      );

      const currentTime = Date.now();

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
  }, [settings.unsplashQuery]);

  const refreshUnsplashIfStale = useCallback(
    (cacheDuration: number) => {
      const unsplashData = unsplashImage;
      const now = Date.now();

      if (
        unsplashData?.timestamp &&
        now - unsplashData.timestamp < cacheDuration
      ) {
        return;
      }

      fetchUnsplashImage();
    },
    [unsplashImage, fetchUnsplashImage],
  );

  useEffect(() => {
    if (
      settings.backgroundType === "unsplash" &&
      settings.unsplashAutoRefresh
    ) {
      const refreshRate = Math.max(settings.unsplashFrequency, 1);
      const refresh_frequency = refreshRate * 60 * 60 * 1000;
      refreshUnsplashIfStale(refresh_frequency);
    }
  }, [
    settings.backgroundType,
    settings.unsplashAutoRefresh,
    settings.unsplashFrequency,
    refreshUnsplashIfStale,
  ]);

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

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  if (loading) {
    return <> </>;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#747ffa",
        },
      }}
    >
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
        {settings.backgroundType === "unsplash" &&
          unsplashImage?.artistLink && (
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
              ) : (
                <IconGrid
                  iconData={localIconData}
                  heightWidth={settings.iconSize}
                  labels={settings.iconLabel}
                  columns={settings.iconColumns}
                  gap={settings.iconGap}
                  setIconData={setLocalIconData}
                  sortType={settings.iconOrder}
                  iconBackground={settings.iconBackground}
                  iconBackgroundColor={settings.iconBackgroundColor}
                  iconBackgroundOpacity={settings.iconBackgroundOpacity}
                  iconBackgroundRadius={settings.iconBackgroundRadius}
                  showAddIconDrawer={showAddIcons}
                  hideAddIconShortcut={settings.hideAddIconShortcut}
                  setIsDragging={setIsDragging}
                />
              ))}
          </div>

          <Drawer
            placement="right"
            onClose={onCloseSettings}
            open={openSettings}
            closable={false}
            width={400}
            styles={{
              content: {
                backgroundColor: "rgba(0, 0, 0, 0.75)",
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
              mask: {
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
                backgroundColor: "rgba(0, 0, 0, 0.75)",
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
              mask: {
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
    </ConfigProvider>
  );
}
