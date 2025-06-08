import { ColorPicker } from "antd";

interface IconBackgroundSettingsProps {
  settings: any;
  handleChange: any;
}

export default function IconBackgroundSettings({
  settings,
  handleChange,
}: IconBackgroundSettingsProps) {
  return (
    settings.iconVisibility && (
      <>
        <div className="form-control w-full max-w mt-4">
          <label className="label cursor-pointer">
            <span className="label-text">Show Icon Background</span>
            <input
              type="checkbox"
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
                <span className="label-text">Icon Background Transparency</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                className="range"
                step="0.01"
                name="iconBackgroundOpacity"
                value={settings.iconBackgroundOpacity}
                onChange={handleChange}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>100</span>
                <span>|</span>
                <span>|</span>
                <span>50</span>
                <span>|</span>
                <span>|</span>
                <span>0</span>
              </div>
            </div>
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">Icon Background Shape</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                className="range"
                step="1"
                name="iconBackgroundRadius"
                value={settings.iconBackgroundRadius}
                onChange={handleChange}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>⬜</span>
                <span>|</span>
                <span>⚪</span>
              </div>
            </div>
            <div className="form-control w-full max-w">
              <label className="label">
                <span className="label-text">Background Color</span>
              </label>
              <ColorPicker
                showText
                value={settings.iconBackgroundColor}
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
          </>
        )}
      </>
    )
  );
}
