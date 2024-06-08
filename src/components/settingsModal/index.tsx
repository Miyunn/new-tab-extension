export default function ChangeSettings({
  setSettings,
  settings,
}: {
  setSettings: [] | any;
  settings: [] | any;
}) {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newSettings = {
      searchBar: formData.get("searchBar") === "on" ? true : false,
      searchEngine: formData.get("searchEngine") as string,
      background: formData.get("background") as string,
    };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  function ResetSettings() {
    localStorage.removeItem("settings");
    setSettings([]);
    location.reload();
  }

  return (
    <dialog id="SettingsModal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg"> Settings </h2>
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

          <div className="divider text-sm">Reset</div>
          <div className="w-full max-w flex space-x-2">
            <button
              type="button"
              onClick={ResetSettings}
              className="btn btn-outline btn-error w-1/2"
            >
              Reset Settings
            </button>
            <button
              type="button"
              className="btn btn-outline btn-error w-1/2"
            >
              Reset Icons
            </button>
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-full">
            Save
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop overflow-hidden">
        <button>close</button>
      </form>
    </dialog>
  );
}
