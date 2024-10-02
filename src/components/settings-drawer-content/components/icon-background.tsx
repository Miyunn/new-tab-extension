import React from "react";
import { ColorPicker } from "antd";

interface IconSettingsProps {
  settings: any;
  setIconBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function IconBackground({
  settings,
  setIconBackgroundColor,
}: IconSettingsProps) {
  return (
    <>
      <div className="divider text-sm pt-2">Icon Background</div>
      <div className="form-control w-full max-w mt-4">
        <label className="label cursor-pointer">
          <span className="label-text">Show Icon Background</span>
          <input
            type="checkbox"
            name="iconBackground"
            className="toggle toggle-primary ml-2"
            defaultChecked={settings.iconBackground}
          />
        </label>
      </div>
      <div className="form-control w-full max-w py-2">
        <label className="label">
          <span className="label-text">Icon Background Opacity</span>
        </label>
        <input
          type="range"
          min="0.01"
          max="1"
          className="range"
          step="0.01"
          name="iconBackgroundOpacity"
          defaultValue={settings.iconBackgroundOpacity}
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
          <span className="label-text">Icon Background Shape</span>
        </label>
        <input
          type="range"
          min="1"
          max="50"
          className="range"
          step="1"
          name="iconBackgroundRadius"
          defaultValue={settings.iconBackgroundRadius}
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
          defaultValue={settings.iconBackgroundColor}
          onChange={(color) => setIconBackgroundColor(`#${color.toHex()}`)}
        />
      </div>
    </>
  );
}
