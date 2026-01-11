import { HandleChange } from "..";
import { Settings } from "../../../types/settings";
import { IconSettingsUI } from "../../schemas/icon.schema";

interface IconSettingsProps {
  settings: Settings;
  handleChange: HandleChange;
}

export default function IconSettings({
  settings,
  handleChange,
}: IconSettingsProps) {
  const showIconMeta = IconSettingsUI.iconVisibility;
  const hideAddIconMeta = IconSettingsUI.hideAddIconShortcut;
  const iconOrderMeta = IconSettingsUI.iconOrder;
  const showIconLabelMeta = IconSettingsUI.iconLabels;
  const iconSizeMeta = IconSettingsUI.iconSize;
  const iconspacingMeta = IconSettingsUI.iconGap;
  const iconGridColumnsMeta = IconSettingsUI.iconColumns;

  return (
    <>
      <div className="divider text-sm pt-2">Icons</div>
      <div className="form-control w-full max-w mt-4">
        <label className="label cursor-pointer">
          <span className="label-text">{showIconMeta.label} </span>
          <input
            type={showIconMeta.control}
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
              <span className="label-text">{hideAddIconMeta.label}</span>
              <input
                type={hideAddIconMeta.control}
                name="hideAddIconShortcut"
                className="toggle toggle-primary ml-2"
                checked={settings.hideAddIconShortcut}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-control w-full max-w">
            <label className="label">
              <span className="label-text">{iconOrderMeta.label}</span>
            </label>
            <select
              name="iconOrder"
              className="select select-bordered w-full max-w"
              value={settings.iconOrder}
              onChange={handleChange}
            >
              {iconOrderMeta.options.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-control w-full max-w mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">{showIconLabelMeta.label}</span>
              <input
                type={showIconLabelMeta.control}
                name="iconLabel"
                className="toggle toggle-primary ml-2"
                checked={settings.iconLabel}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{iconSizeMeta.label}</span>
            </label>
            <input
              name="iconSize"
              type={iconSizeMeta.control}
              className={iconSizeMeta.control}
              min={iconSizeMeta.min}
              max={iconSizeMeta.max}
              step={iconSizeMeta.step}
              value={settings.iconSize}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>{iconSizeMeta.labels[0]}</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>{iconSizeMeta.labels[1]}</span>
            </div>
          </div>
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{iconspacingMeta.label}</span>
            </label>
            <input
              name="iconGap"
              type={iconspacingMeta.control}
              className={iconspacingMeta.control}
              min={iconspacingMeta.min}
              max={iconspacingMeta.max}
              step={iconspacingMeta.step}
              value={settings.iconGap}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>{iconspacingMeta.labels[0]}</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>{iconspacingMeta.labels[1]}</span>
            </div>
          </div>
          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{iconGridColumnsMeta.label}</span>
            </label>
            <input
              name="iconColumns"
              type={iconGridColumnsMeta.control}
              className={iconGridColumnsMeta.control}
              min={iconGridColumnsMeta.min}
              max={iconGridColumnsMeta.max}
              step={iconGridColumnsMeta.step}
              value={settings.iconColumns}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              {iconGridColumnsMeta.labels.map((label) => (
                <span>{label}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
