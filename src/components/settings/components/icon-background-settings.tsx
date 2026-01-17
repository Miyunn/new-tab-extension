import { ColorPicker } from "antd";
import { Settings } from "../../../types/settings";
import { HandleChange } from "..";
import { IconSettingsUI } from "../../../schemas/icon.schema";

interface IconBackgroundSettingsProps {
  settings: Settings;
  handleChange: HandleChange;
}

export default function IconBackgroundSettings({
  settings,
  handleChange,
}: IconBackgroundSettingsProps) {
  const enableIconBackgroundMeta = IconSettingsUI.iconBackground;
  const iconBackgroundOpacityMeta = IconSettingsUI.iconBackgroundOpacity;
  const iconShapeMeta = IconSettingsUI.iconBackgroundRadius;
  const iconBackgroundColorMeta = IconSettingsUI.iconBackgroundColor;

  return (
    settings.iconVisibility && (
      <>
        <div className="form-control w-full max-w mt-4">
          <label className="label cursor-pointer">
            <span className="label-text">{enableIconBackgroundMeta.label}</span>
            <input
              type={enableIconBackgroundMeta.control}
              name="iconBackground"
              className="toggle toggle-primary ml-2"
              checked={settings.iconBackground}
              onChange={handleChange}
            />
          </label>
        </div>
        {settings.iconBackground && (
          <>
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">
                  {iconBackgroundOpacityMeta.label}
                </span>
              </label>
              <input
                type={iconBackgroundOpacityMeta.control}
                min="0"
                max="1"
                className={iconBackgroundOpacityMeta.control}
                step={iconBackgroundOpacityMeta.step}
                name="iconBackgroundOpacity"
                value={settings.iconBackgroundOpacity}
                onChange={handleChange}
              />
              <div className="w-full flex justify-between text-xs px-2 pt-1">
                <span>{iconBackgroundOpacityMeta.labels[0]}</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>{iconBackgroundOpacityMeta.labels[1]}</span>
              </div>
            </div>
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">{iconShapeMeta.label}</span>
              </label>
              <input
                type={iconShapeMeta.control}
                min={iconShapeMeta.min}
                max={iconShapeMeta.max}
                className={iconShapeMeta.control}
                step={iconShapeMeta.step}
                name="iconBackgroundRadius"
                value={settings.iconBackgroundRadius}
                onChange={handleChange}
              />
              <div className="w-full flex justify-between text-xs px-2 pt-1">
                <span>{iconShapeMeta.labels[0]}</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>{iconShapeMeta.labels[1]}</span>
              </div>
            </div>
            <div className="form-control w-full max-w transparent-color-picker px-2 pt-3">
              <div className="flex items-center justify-between gap-4">
                <span className="label-text whitespace-nowrap">
                  {iconBackgroundColorMeta.lable}
                </span>
                <ColorPicker
                  showText
                  value={settings.iconBackgroundColor}
                  disabledAlpha={true}
                  size="small"
                  onChange={(color) => {
                    handleChange({
                      target: {
                        name: "iconBackgroundColor",
                        type: "text",
                        value: `#${color.toHex()}`,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </>
        )}
      </>
    )
  );
}
