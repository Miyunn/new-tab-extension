import React from "react";
import { startTransition } from "react";
import { ColorPicker } from "antd";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import db from "../../../database/indexDb";
import { Settings } from "../../../types/settings";
import { HandleChange } from "..";
import { WallpaperUI } from "../../schemas/wallpaper.schema";

interface WallpaperSettingsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  handleChange: HandleChange;
  forceUnsplashFetch: () => void;
}

export default function WallpaperSettings({
  settings,
  setSettings,
  handleChange,
  forceUnsplashFetch,
}: WallpaperSettingsProps) {
  const [error, setError] = useState("");

  const wallpaperTypeMeta = WallpaperUI.backgroundType;
  const wallpaperTintMeta = WallpaperUI.backgroundTintIntensity;
  const wallpaperBlurMeta = WallpaperUI.blurValue;
  const unsplashFrequency = WallpaperUI.unsplashFrequency;
  const wallpaperRes = WallpaperUI.unsplashQuality;

  type BackgroundType = Settings["backgroundType"];

  const handleUnsplashFrequencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const index = parseInt(e.target.value);
    const frequency = unsplashFrequency.values[index];

    setSettings((prev) => ({
      ...prev,
      unsplashFrequency: frequency,
    }));
  };

  const backgroundOptions: BackgroundType[] = [
    "unsplash",
    "color",
    "image",
    "url",
  ];

  const setBackgroundType = (newType: BackgroundType) => {
    startTransition(() => {
      setSettings((prev) => ({
        ...prev,
        backgroundType: newType,
      }));
    });
  };

  async function handleImageUpload(file: File): Promise<string> {
    const imageDataUrl = await uploadImage(file);
    await db.wallpaper.update(1, { data: imageDataUrl });
    return "success";
  }

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
  const imageUploadValidation = async (
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
      try {
        const result = await handleImageUpload(file);
        console.log(result);
      } catch (err) {
        setError("Failed to upload image");
        console.error("Upload error:", err);
      }
    }
  };

  return (
    <>
      <div className="divider text-sm">Wallpaper</div>
      <div className="form-control w-full max-w">
        <label className="label">
          <span className="label-text">{wallpaperTypeMeta.label}</span>
        </label>
        <select
          name="backgroundType"
          className="select select-bordered w-full max-w"
          value={settings.backgroundType}
          onChange={(e) => {
            const value = e.target.value;
            if (backgroundOptions.includes(value as BackgroundType)) {
              setBackgroundType(value as BackgroundType);
            }
          }}
        >
          {wallpaperTypeMeta.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {settings.backgroundType === "color" && (
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Background Color</span>
          </label>
          <ColorPicker
            showText
            value={settings.backgroundColor}
            onChange={(color) => {
              const hex = `#${color.toHex()}`;

              setSettings((prev) => ({
                ...prev,
                backgroundColor: hex,
              }));
            }}
          />
        </div>
      )}

      {settings.backgroundType === "image" && (
        <div className="form-control w-full max-w">
          <label className="form-control w-full max-w">
            <div className="label">
              <span className="label-text">Pick an image</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered"
              name="backgroundImage"
              onChange={imageUploadValidation}
            />
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {settings.backgroundType === "url" && (
        <div className="form-control w-full max-w">
          <label className="form-control w-full max-w">
            <div className="label">
              <span className="label-text">Image URL</span>
            </div>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Paste URL here"
              name="backgroundUrl"
              required
              value={settings.backgroundUrl}
              onChange={handleChange}
            />
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {(settings.backgroundType === "image" ||
        settings.backgroundType === "url" ||
        settings.backgroundType === "unsplash") && (
        <>
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{wallpaperTypeMeta.label}</span>
            </label>
            <input
              type={wallpaperTintMeta.control}
              min={wallpaperTintMeta.min}
              max={wallpaperTintMeta.max}
              className="range"
              step={wallpaperTintMeta.step}
              name="backgroundTintIntensity"
              value={settings.backgroundTintIntensity}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>{wallpaperTintMeta.labels[0]}</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>50%</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>{wallpaperTintMeta.labels[1]}</span>
            </div>
          </div>

          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{wallpaperBlurMeta.label}</span>
            </label>
            <input
              type={wallpaperBlurMeta.control}
              min={wallpaperBlurMeta.min}
              max={wallpaperBlurMeta.max}
              className="range"
              step={wallpaperBlurMeta.step}
              name="blurValue"
              value={settings.blurValue}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>0%</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>50%</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>100</span>
            </div>
          </div>
        </>
      )}
      {settings.backgroundType === "unsplash" && (
        <>
          <div className="form-control w-full max-w py-2">
            <Tooltip id="unsplash-quality-tool-tip" className="z-50">
              Lower resolutions load faster and are ideal when using a blur
              effect. For better performance, consider choosing a lower quality
              setting.
            </Tooltip>
            <Tooltip id="unsplash-query-tool-tip" className="z-50">
              Use this field to search Unsplash for wallpapers based on a
              specific query.
              <br />
              For example, enter "nature" or "space" to find relevant images.
              <br />
              Results will be randomly selected based on your keyword.
            </Tooltip>
            <label className="label">
              <span className="label-text">Search Wallpapers</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-question-circle"
                viewBox="0 0 16 16"
                data-tooltip-id="unsplash-query-tool-tip"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
              </svg>
            </label>
            <input
              type="text"
              placeholder="Type a keyword"
              className="input w-full max-w"
              name="unsplashQuery"
              value={settings.unsplashQuery}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-outline btn-primary my-3 w-full"
            onClick={forceUnsplashFetch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
              />
              <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192" />
            </svg>
            Shuffle Wallpaper
          </button>

          <div className="form-control w-full max-w mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">Auto-change Wallpaper</span>
              <input
                type="checkbox"
                name="unsplashAutoRefresh"
                className="toggle toggle-primary ml-2"
                checked={settings.unsplashAutoRefresh}
                onChange={handleChange}
              />
            </label>
          </div>

          {settings.unsplashAutoRefresh == true && (
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">{unsplashFrequency.label}</span>
              </label>
              <div className="form-control w-full max-w py-2">
                <input
                  type={unsplashFrequency.control}
                  min="0"
                  max={unsplashFrequency.labels.length - 1}
                  step="1"
                  className="range"
                  value={unsplashFrequency.values.indexOf(
                    settings.unsplashFrequency,
                  )}
                  onChange={handleUnsplashFrequencyChange}
                />
                <div className="w-full flex justify-between text-xs px-2">
                  {unsplashFrequency.labels.map((label) => (
                    <span key={label}> {label} </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{wallpaperRes.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-question-circle"
                viewBox="0 0 16 16"
                data-tooltip-id="unsplash-quality-tool-tip"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
              </svg>
            </label>
            <input
              type={wallpaperRes.control}
              min={wallpaperRes.min}
              max={wallpaperRes.max}
              className="range"
              step={wallpaperRes.step}
              name="unsplashQuality"
              value={settings.unsplashQuality}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              {wallpaperRes.labels.map((label) => (
                <span>{label}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
