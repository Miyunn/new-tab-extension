import { HandleChange } from "..";
import { Settings } from "../../../types/settings";
import { SearchSettingsUI } from "../../../schemas/search.schema";

const isFirefox = chrome.runtime?.getURL("").startsWith("moz-extension://");

interface SearchbarSettingsProps {
  settings: Settings;
  handleChange: HandleChange;
}
export default function SearchbarSettings({
  settings,
  handleChange,
}: SearchbarSettingsProps) {
  const searchbarToggleMeta = SearchSettingsUI.searchBar;
  const searchEngineMeta = SearchSettingsUI.searchEngine;
  const searchBarWidthMeta = SearchSettingsUI.searchBarWidth;

  return (
    <>
      <div className="divider text-sm">Search Bar</div>
      <div className="form-control w-full max-w mt-4">
        <label className="label cursor-pointer">
          <span className="label-text">{searchbarToggleMeta.label}</span>
          <input
            type={searchbarToggleMeta.control}
            name="searchBar"
            className="toggle toggle-primary ml-2"
            checked={settings.searchBar}
            onChange={handleChange}
          />
        </label>
      </div>
      {settings.searchBar && (
        <>
          <div className="form-control w-full max-w">
            <label className="label">
              <span className="label-text">{searchEngineMeta.label}</span>
            </label>
            <select
              name="searchEngine"
              className="select select-bordered w-full max-w"
              value={settings.searchEngine}
              onChange={handleChange}
            >
              {!isFirefox && (
                <option value="chromeSearch">Use Browser Default</option>
              )}
              {searchEngineMeta.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {settings.searchEngine === "custom" && (
            <div className="form-control w-full max-w py-2">
              <label className="label">
                <span className="label-text">Search Engine URL</span>
              </label>
              <input
                type="text"
                placeholder="E.g. https://google.com/search?q="
                className="input w-full max-w"
                name="customSearchEngineUrl"
                value={settings.customSearchEngineUrl}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-control w-full max-w py-2">
            <label className="label">
              <span className="label-text">{searchbarToggleMeta.label}</span>
            </label>
            <input
              type={searchBarWidthMeta.control}
              min={searchBarWidthMeta.min}
              max={searchBarWidthMeta.max}
              className={searchBarWidthMeta.control}
              step={searchBarWidthMeta.step}
              name="searchBarWidth"
              value={settings.searchBarWidth}
              onChange={handleChange}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>{searchBarWidthMeta.labels[0]}</span>
              <span>|</span>
              <span>|</span>
              <span>{searchBarWidthMeta.labels[1]}</span>
              <span>|</span>
              <span>|</span>
              <span>{searchBarWidthMeta.labels[2]}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
