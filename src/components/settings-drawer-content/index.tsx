import { useState } from "react";
import { ColorPicker } from "antd";
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

  const [backgroundColor, setBackgroundColor] = useState(
    settings.backgroundColor || "#1677ff",
  );

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
      backgroundImage: formData.get("backgroundImage") as string,
      backgroundColor: `#${backgroundColor}`,
      version: settings.version,
    };

    try {
      setSettings(newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error adding icon", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 700));
    setPending(false);
    closeDrawer();
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
        <div className="divider text-sm">Background</div>
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Background Type</span>
          </label>
          <select
            name="backgroundType"
            className="select select-bordered w-full max-w"
            defaultValue={settings.backgroundType}
          >
            <option value="dark">Dark Gradient</option>
            <option value="light" disabled>
              Light Gradient
            </option>
            <option value="color">Solid Color</option>
            <option value="image" disabled>
              Custom Image
            </option>
          </select>
        </div>

        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Background Color</span>
          </label>
          <ColorPicker
            showText
            defaultValue={backgroundColor}
            onChange={(color) => setBackgroundColor(color.toHex())}
          />
        </div>
        <div className="divider text-sm">Search Bar</div>
        <div className="form-control w-full max-w mt-4">
          <label className="label cursor-pointer">
            <span className="label-text">Show Search Bar</span>
            <input
              type="checkbox"
              name="searchBar"
              className="toggle toggle-primary ml-2"
              defaultChecked={settings.searchBar}
            />
          </label>
        </div>
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Search Engine</span>
          </label>
          <select
            name="searchEngine"
            className="select select-bordered w-full max-w"
            defaultValue={settings.searchEngine}
          >
            <option value="google">Google</option>
            <option value="bing">Bing</option>
            <option value="duckduckgo">DuckDuckGo</option>
          </select>
        </div>
        <div className="form-control w-full max-w py-2">
          <label className="label">
            <span className="label-text">Search Bar Width</span>
          </label>
          <input
            type="range"
            min="250"
            max="550"
            className="range"
            step="10"
            name="searchBarWidth"
            defaultValue={settings.searchBarWidth}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>250px</span>
            <span>|</span>
            <span>|</span>
            <span>400px</span>
            <span>|</span>
            <span>|</span>
            <span>550px</span>
          </div>
        </div>
        <div className="divider text-sm pt-2">Icons</div>
        <div className="form-control w-full max-w mt-4">
          <label className="label cursor-pointer">
            <span className="label-text">Show Icons</span>
            <input
              type="checkbox"
              name="iconVisibility"
              className="toggle toggle-primary ml-2"
              defaultChecked={settings.iconVisibility}
            />
          </label>
        </div>
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Icon Layout</span>
          </label>
          <select
            name="layoutStyle"
            className="select select-bordered w-full max-w"
            defaultValue={settings.iconLayout}
          >
            <option value="grid">Grid Style</option>
            <option disabled>Other Styles are coming soon</option>
          </select>
        </div>
        <div className="form-control w-full max-w">
          <label className="label">
            <span className="label-text">Icon Order</span>
          </label>
          <select
            name="iconOrder"
            className="select select-bordered w-full max-w"
            defaultValue={settings.iconOrder}
          >
            <option value="name">Name</option>
            <option value="position">Custom</option>
          </select>
        </div>
        <div className="form-control w-full max-w mt-4">
          <label className="label cursor-pointer">
            <span className="label-text">Icons Labels</span>
            <input
              type="checkbox"
              name="iconLabel"
              className="toggle toggle-primary ml-2"
              defaultChecked={settings.iconLabel}
            />
          </label>
        </div>
        <div className="form-control w-full max-w py-2">
          <label className="label">
            <span className="label-text">Icon Size</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            className="range"
            step="1"
            name="iconSize"
            defaultValue={settings.iconSize}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>0</span>
            <span>|</span>
            <span>|</span>
            <span>50</span>
            <span>|</span>
            <span>|</span>
            <span>100</span>
          </div>
        </div>
        <div className="form-control w-full max-w py-2">
          <label className="label">
            <span className="label-text">Icon Spacing</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            className="range"
            step="1"
            name="iconGap"
            defaultValue={settings.iconGap}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>0</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>50</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>100</span>
          </div>
        </div>
        <div className="form-control w-full max-w py-2">
          <label className="label">
            <span className="label-text">Grid Columns</span>
          </label>
          <input
            type="range"
            min="1"
            max="9"
            className="range"
            step="1"
            name="iconColumns"
            defaultValue={settings.iconColumns}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
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
          >
            Remove Icons
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full"
          disabled={pending}
        >
          {pending ? "Saved" : "Save"}
        </button>
      </form>

      <div className="text-right text-sm text-slate-600 pt-2">
        Version : {settings.version}
      </div>
    </div>
  );
}
