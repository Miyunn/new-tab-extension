import { useState } from "react";
import db from "../../database/indexDb";
import { FastAverageColor } from "fast-average-color";
import WallpaperSettings from "./components/wallpaper-settings";
import SearchbarSettings from "./components/searchbar-settings";
import IconSettings from "./components/icon-settings";
import ResetOptionSettings from "./components/reset-options";
import BackupAndRestore from "./components/export-import-settings";
import IconBackground from "./components/icon-background";

const fac = new FastAverageColor();

// image upload function
async function handleImageUpload(file: File): Promise<string> {
  try {
    const imageDataUrl = await uploadImage(file);
    // @ts-ignore
    await db.wallpaper.update(1, { data: imageDataUrl });
    const colorHex = await getColorFromImage(imageDataUrl);
    return colorHex;
  } catch (error) {
    throw error;
  }
}

// Validates file size and type during saving
function uploadImage(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (file.size > 8 * 1024 * 1024 || !file.type.startsWith("image/")) {
      reject(new Error("File size is too large or not an image file"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      resolve(imageDataUrl);
    };

    reader.onerror = () => {
      reader.abort();
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
}

// grabs the most common colour from the wallpaper
// function not in use yet, but I have plans for this :>
async function getColorFromImage(imageDataUrl: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const color = await fac.getColorAsync(img);
        resolve(color.hex);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load the image"));
    };

    img.src = imageDataUrl;
  });
}

export default function ChangeSettings({
  setSettings,
  settings,
  closeDrawer,
}: {
  setSettings: [] | any;
  settings: [] | any;
  closeDrawer: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(
    settings.backgroundColor || "#1677ff",
  );
  const [backgroundType, setBackgroundType] = useState(
    settings.backgroundType || "dark",
  );
  const [iconBackgroundColor, setIconBackgroundColor] = useState(
    settings.iconBackgroundColor || "#ffffff",
  );
  const [accentColor] = useState(settings.accentColor || "#000000");

  const [unsplashFrequency, setUnsplashFrequency] = useState(
    settings.unslpashFrequency || 4,
  );

  //Validates image when selected and blocks upload (disable save button)
  const imageUploadValidation = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError("File size must be less than 8MB");
        return;
      }
      setError("");
    }
  };

  const unsplashFrequencyHours = [1, 4, 8, 12, 24];

  const handleUnsplashFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedIndex = Number(event.target.value);
    setUnsplashFrequency(unsplashFrequencyHours[selectedIndex]); // Use the index to grab value from array
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSettings = {
      searchBar: formData.get("searchBar") === "on" ? true : false,
      searchEngine: formData.get("searchEngine") as string,
      searchBarWidth: formData.get("searchBarWidth") as string,
      background: formData.get("background") as string,
      iconVisibility: formData.get("iconVisibility") === "on" ? true : false,
      layoutStyle: formData.get("layoutStyle") as string,
      iconLabel: formData.get("iconLabel") === "on" ? true : false,
      iconSize: formData.get("iconSize") as string,
      iconColumns: formData.get("iconColumns") as string,
      iconGap: formData.get("iconGap") as string,
      iconOrder: formData.get("iconOrder") as string,
      backgroundType: formData.get("backgroundType") as string,
      backgroundColor: `${backgroundColor}`,
      backgroundUrl: formData.get("backgroundUrl") as string,
      iconBackground: formData.get("iconBackground") === "on" ? true : false,
      iconBackgroundColor: `${iconBackgroundColor}`,
      iconBackgroundOpacity: formData.get("iconBackgroundOpacity") as string,
      iconBackgroundRadius: formData.get("iconBackgroundRadius") as string,
      version: settings.version,
      lastUpdated: new Date().toISOString(),
      detectedBrowserType: settings.detectedBrowserType,
      backgroundTintIntensity: formData.get(
        "backgroundTintIntensity",
      ) as string,
      blurValue: formData.get("blurValue") as string,
      accentColor: `${accentColor}`,
      unsplashQuery: formData.get("unsplashQuery") as string,
      unsplashQuality: formData.get("unsplashQuality") as string,
      unsplashFrequency: unsplashFrequency,
    };

    try {
      const backgroundImageFile = formData.get("backgroundImage") as File;
      if (backgroundImageFile && backgroundImageFile.size > 0) {
        const colorHex = await handleImageUpload(backgroundImageFile);
        newSettings.accentColor = colorHex;
      }
      setSettings(newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
      setPending(false);
      closeDrawer();
    } catch (error) {
      setError("Error saving settings");
    }
  };

  function ResetSettings() {
    localStorage.removeItem("settings");
    setSettings([]);
    location.reload();
  }

  function ForceRefreshUnsplashWallpaper() {
    localStorage.removeItem("unsplashData");
    setSettings([]);
    location.reload();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <WallpaperSettings
          settings={settings}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          backgroundType={backgroundType}
          setBackgroundType={setBackgroundType}
          imageUploadValidation={imageUploadValidation}
          handleUnsplashFrequencyChange={handleUnsplashFrequencyChange}
          unsplashFrequencyHours={unsplashFrequencyHours}
          error={error}
          forceResetUnsplashWallpaper={ForceRefreshUnsplashWallpaper}
        />
        <SearchbarSettings settings={settings} />
        <IconSettings settings={settings} />
        <IconBackground
          settings={settings}
          setIconBackgroundColor={setIconBackgroundColor}
        />
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={pending || (error !== "" ? true : false)}
        >
          {pending ? "Saving..." : error !== "" ? error : "Save"}
        </button>
      </form>

      <div className="mt-6">
        <BackupAndRestore />
        <ResetOptionSettings resetSettings={ResetSettings} />
      </div>
      <div className="text-right text-xs text-slate-600 pt-2">
        App Version : 0.6
      </div>
    </div>
  );
}
