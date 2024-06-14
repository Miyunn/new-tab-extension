import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";

export default function AddIconForm() {
  const [useIconURLToggle, setUseIconURLToggle] = useState(true);

  const handleUseIconURLToggle = () => {
    setUseIconURLToggle(!useIconURLToggle);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newIcon = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      iconURL: formData.get("iconURL") as string,
    };

    //@ts-ignore
    await db.icons.add({
      name: newIcon.name,
      src: newIcon.iconURL,
      url: newIcon.destination,
    });
  };

  return (
    <div className="bg-black flex justify-center items-center">
      <form className="max-w-md" onSubmit={handleSubmit}>
        <div className="divider text-sm">Add Icon</div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
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
            name="destination"
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
              disabled
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
              name="iconURL"
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
