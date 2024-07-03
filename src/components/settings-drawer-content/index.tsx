import { useState } from "react";
import db from "../../database/indexDb";
import { FastAverageColor } from "fast-average-color";
import WallpaperSettings from "./components/wallpaper-settings";
import SearchbarSettings from "./components/searchbar-settings";
import IconSettings from "./components/icon-settings";

const fac = new FastAverageColor();

// image upload function
async function handleImageUpload(file: File): Promise<string> {
  try {
    const imageDataUrl = await uploadImage(file);
    // @ts-ignore
    await db.wallpaper.update(1, { data: imageDataUrl });
    const colorHex = await getColorFromImage(imageDataUrl);
    console.log("Color from image:", colorHex);
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
// function not in use yet, but will put to use later :>
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
      backgroundColor: `#${backgroundColor}`,
      backgroundUrl: formData.get("backgroundUrl") as string,
      version: settings.version,
      backgroundTintIntensity: formData.get(
        "backgroundTintIntensity",
      ) as string,
      blurValue: formData.get("blurValue") as string,
    };

    try {
      const backgroundImageFile = formData.get("backgroundImage") as File;
      if (backgroundImageFile && backgroundImageFile.size > 0) {
        const colorHex = await handleImageUpload(backgroundImageFile);
        newSettings.backgroundColor = colorHex;
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
  return (
    <div className="bg-black">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg"> Settings </h2>
        <WallpaperSettings
          settings={settings}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          backgroundType={backgroundType}
          setBackgroundType={setBackgroundType}
          imageUploadValidation={imageUploadValidation}
          error={error}
        />
        <SearchbarSettings settings={settings} />
        <IconSettings settings={settings} />

        <div className="divider text-sm">Reset</div>
        <div className="flex w-full max-w ">
          <button
            type="button"
            onClick={ResetSettings}
            className="btn btn-outline btn-error flex-grow mr-2"
          >
            Reset Settings
          </button>
          <button
            type="button"
            className="btn btn-outline btn-error w-1/2  ml-2"
            disabled
          >
            Remove Icons
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full"
          disabled={pending || (error !== "" ? true : false)}
        >
          {pending ? "Saving..." : error !== "" ? error : "Save"}
        </button>
      </form>
      <div className="text-right text-xs text-slate-600 pt-2">
        Version : {settings.version}
      </div>
    </div>
  );
}
