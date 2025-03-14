const isFirefox = chrome.runtime?.getURL("").startsWith("moz-extension://");

interface SearchbarSettingsProps {
  settings: any;
}
export default function SearchbarSettings({
  settings,
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
          {!isFirefox && <option value="chromeSearch">Browser Default</option>}
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
    </>
  );
}
