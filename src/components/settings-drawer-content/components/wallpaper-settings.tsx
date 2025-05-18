import React from "react";
import { ColorPicker } from "antd";
import { Tooltip } from "react-tooltip";

interface WallpaperSettingsProps {
  settings: any;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  backgroundType: string;
  setBackgroundType: React.Dispatch<React.SetStateAction<string>>;
  imageUploadValidation: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUnsplashFrequencyChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  unsplashFrequencyHours: number[];
  error: string;
  forceResetUnsplashWallpaper: () => void;
}

export default function WallpaperSettings({
  settings,
  backgroundColor,
  setBackgroundColor,
  backgroundType,
  setBackgroundType,
  imageUploadValidation,
  handleUnsplashFrequencyChange,
  unsplashFrequencyHours,
  error,
  forceResetUnsplashWallpaper,
}: WallpaperSettingsProps) {
  return (
    <>
      <div className="divider text-sm">Wallpaper</div>
      <div className="form-control w-full max-w">
        <label className="label">
          <span className="label-text">Wallpaper Source</span>
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
          <option value="unsplash">Unslpash (Random)</option>
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
            <Tooltip id="unsplash-quality-tool-tip" className="z-50">
              Adjust the resolution of the Unsplash wallpaper to suit your
              needs:
              <br />- <strong>Low</strong>: Optimized for faster loading; ideal
              when using heavy blur effects.
              <br />- <strong>Medium</strong>: A balanced choice for good image
              quality and quick load times.
              <br />- <strong>High</strong>: Perfect for high-resolution
              screens; may slow down the new tab's opening speed.
              <br />- <strong>Original</strong>: Maximum resolution for the best
              quality but may significantly impact loading performance.
            </Tooltip>
            <Tooltip id="unsplash-query-tool-tip" className="z-50">
              Use this field to search Unsplash for wallpapers based on a
              specific query.
              <br />
              For example, enter "nature" or "space" to find relevant images.
              <br />
              Results will be randomly selected based on your query.
            </Tooltip>
            <Tooltip id="unsplash-frequency-tool-tip" className="z-50">
              Use this slider to set how often the wallpaper updates
              automatically. The selected interval determines how frequently a
              new wallpaper is fetched from Unsplash.
              <br />
              Wallpapers are cached locally to optimize performance and reduce
              API usage.
            </Tooltip>
            <label className="label">
              <span className="label-text">Wallpaper Query</span>
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
              defaultValue={settings.unsplashQuery}
            />
          </div>

          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">Wallpaper Quality</span>
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
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">Refresh Wallpaper Every</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-question-circle"
                viewBox="0 0 16 16"
                data-tooltip-id="unsplash-frequency-tool-tip"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
              </svg>
            </label>
            <div className="form-control w-full max-w py-2">
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                defaultValue={unsplashFrequencyHours.indexOf(
                  settings.unsplashFrequency,
                )}
                onChange={handleUnsplashFrequencyChange} // Fixed typo
                className="range"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>1h</span>
                <span>4h</span>
                <span>8h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary my-3 w-full"
            onClick={forceResetUnsplashWallpaper}
          >
            Get Random Wallpaper
          </button>
        </>
      )}
    </>
  );
}
