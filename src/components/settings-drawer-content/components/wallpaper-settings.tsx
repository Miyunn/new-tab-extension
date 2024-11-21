import React from "react";
import { ColorPicker } from "antd";

interface WallpaperSettingsProps {
  settings: any;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  backgroundType: string;
  setBackgroundType: React.Dispatch<React.SetStateAction<string>>;
  imageUploadValidation: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

export default function WallpaperSettings({
  settings,
  backgroundColor,
  setBackgroundColor,
  backgroundType,
  setBackgroundType,
  imageUploadValidation,
  error,
}: WallpaperSettingsProps) {
  return (
    <>
      <div className="divider text-sm">Wallpaper</div>
      <div className="form-control w-full max-w">
        <label className="label">
          <span className="label-text">Wallpaper Type</span>
        </label>
        <select
          name="backgroundType"
          className="select select-bordered w-full max-w"
          defaultValue={settings.backgroundType}
          onChange={(e) => setBackgroundType(e.target.value)}
        >
          <option value="dark">Default</option>
          <option value="color">Solid Color</option>
          <option value="image">Image</option>
          <option value="url">URL</option>
          <option value="unsplash">Random Wallpaper (Unsplashed)</option>
        </select>
      </div>

      {backgroundType === "color" && (
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Background Color</span>
          </label>
          <ColorPicker
            showText
            defaultValue={backgroundColor}
            onChange={(color) => setBackgroundColor(`#${color.toHex()}`)}
          />
        </div>
      )}

      {backgroundType === "image" && (
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

      {backgroundType === "url" && (
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
              defaultValue={settings.backgroundUrl}
            />
          </label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {(backgroundType === "image" ||
        backgroundType === "url" ||
        backgroundType === "unsplash") && (
          <>
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">Wallpaper tint</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                className="range"
                step="0.001"
                name="backgroundTintIntensity"
                defaultValue={settings.backgroundTintIntensity}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>No Tint</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>50%</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>Black</span>
              </div>
            </div>

            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">Wallpaper blur</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                className="range"
                step="0.01"
                name="blurValue"
                defaultValue={settings.blurValue}
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
      {backgroundType === "unsplash" && (
        <>
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">Wallpaper Query</span>
            </label>
            <input
              type="text"
              placeholder="Query unsplash for wallpapers"
              className="input w-full max-w"
              name="unsplashQuery"
              defaultValue={settings.unsplashQuery}
            />
          </div>

          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">Wallpaper Quality</span>
            </label>
            <input
              type="range"
              min="0"
              max="3"
              className="range"
              step="1"
              name="unsplashQuality"
              defaultValue={settings.unsplashQuality}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Original</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
