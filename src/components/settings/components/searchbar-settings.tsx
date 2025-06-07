const isFirefox = chrome.runtime?.getURL("").startsWith("moz-extension://");

interface SearchbarSettingsProps {
  settings: any;
  handleChange: any;
}
export default function SearchbarSettings({
  settings,
  handleChange,
}: SearchbarSettingsProps) {
  return (
    <>
      <div className="divider text-sm">Search Bar</div>
      <div className="form-control w-full max-w mt-4">
        <label className="label cursor-pointer">
          <span className="label-text">Show Search Bar</span>
          <input
            type="checkbox"
            name="searchBar"
            className="toggle toggle-primary ml-2"
            checked={settings.searchBar}
            onChange={handleChange}
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
          value={settings.searchEngine}
          onChange={handleChange}
        >
          {!isFirefox && <option value="chromeSearch">Browser Default</option>}
          <option value="google">Google</option>
          <option value="bing">Bing</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="custom">Custom</option>
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
          <span className="label-text">Search Bar Width</span>
        </label>
        <input
          type="range"
          min="250"
          max="550"
          className="range"
          step="10"
          name="searchBarWidth"
          value={settings.searchBarWidth}
          onChange={handleChange}
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
    </>
  );
}
