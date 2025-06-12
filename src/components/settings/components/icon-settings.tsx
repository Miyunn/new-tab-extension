interface IconSettingsProps {
  settings: any;
  handleChange: any;
}

export default function IconSettings({
  settings,
  handleChange,
}: IconSettingsProps) {
  return (
    <>
      <div className="divider text-sm pt-2">Icons</div>
      <div className="form-control w-full max-w mt-4">
        <label className="label cursor-pointer">
          <span className="label-text">Show Icons</span>
          <input
            type="checkbox"
            name="iconVisibility"
            className="toggle toggle-primary ml-2"
            checked={settings.iconVisibility}
            onChange={handleChange}
          />
        </label>
      </div>
      {settings.iconVisibility && (
        <>
          <div className="form-control w-full max-w mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">Add Icon Shortcut</span>
              <input
                type="checkbox"
                name="showAddIcon"
                className="toggle toggle-primary ml-2"
                checked={settings.showAddIcon}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-control w-full max-w hidden">
            <label className="label">
              <span className="label-text">Icon Layout</span>
            </label>
            <select
              name="layoutStyle"
              className="select select-bordered w-full max-w disabled"
              value={settings.iconLayout}
              onChange={handleChange}
            >
              <option value="grid">Grid Style</option>
            </select>
          </div>
          <div className="form-control w-full max-w">
            <label className="label">
              <span className="label-text">Icon Order</span>
            </label>
            <select
              name="iconOrder"
              className="select select-bordered w-full max-w"
              value={settings.iconOrder}
              onChange={handleChange}
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
                checked={settings.iconLabel}
                onChange={handleChange}
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
              value={settings.iconSize}
              onChange={handleChange}
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
              value={settings.iconGap}
              onChange={handleChange}
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
              value={settings.iconColumn}
              onChange={handleChange}
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
        </>
      )}
    </>
  );
}
