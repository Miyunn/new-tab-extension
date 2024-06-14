import { useState } from "react";
import "./styles.css";

export default function AddIconForm() {
  const [useIconURLToggle, setUseIconURLToggle] = useState(false);

  const handleUseIconURLToggle = () => {
    setUseIconURLToggle(!useIconURLToggle);
  };

  return (
    <div className="bg-black flex justify-center items-center">
      <form className="max-w-md">
        <div className="divider text-sm">Add Icon</div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Icon label"
            className="input input-bordered add-icon-form-input"
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Destination</span>
          </label>
          <input
            type="text"
            placeholder="Where to?"
            className="input input-bordered add-icon-form-input"
          />
        </div>
        <div className="form-control w-full max-w mt-4">
          <label className="label">
            <span className="label-text">Use Image URL for Icon</span>
            <input
              type="checkbox"
              name="searchBar"
              className="toggle toggle-primary ml-2"
              checked={useIconURLToggle}
              onChange={handleUseIconURLToggle}
            />
          </label>
        </div>
        {useIconURLToggle ? (
          <div className="form-control w-full max-w mt-4">
            <label className="label">
              <span className="label-text">Icon URL</span>
            </label>
            <input
              type="text"
              placeholder="Image URL here"
              className="input input-bordered add-icon-form-input"
            />
          </div>
        ) : (
          <div className="form-control w-full max-w mt-4">
            <label className="label">
              <span className="label-text">Icon Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs add-icon-form-input"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full">
          Save
        </button>
      </form>
    </div>
  );
}
