import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";

export default function AddIconForm({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) {
  const [useIconURLToggle, setUseIconURLToggle] = useState(true);

  const handleUseIconURLToggle = () => {
    setUseIconURLToggle(!useIconURLToggle);
  };

  const [pending, setPending] = useState(false);

  const clearForm = () => {
    const form = document.querySelector(
      "form[name='addIconForm']",
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setPending(true);

    const formData = new FormData(event.currentTarget);

    const newIcon = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      iconURL: formData.get("iconURL") as string,
    };

    //@ts-ignore
    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    try {
      // wait 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //@ts-ignore
      await db.icons.add({
        id: crypto.randomUUID(),
        name: newIcon.name,
        src: newIcon.iconURL,
        url: newIcon.destination,
        position: newPosition,
      });
    } catch (error) {
      console.error("Error adding icon", error);
    }

    setPending(false);
    closeDrawer();
    clearForm();
  };

  return (
    <div className="bg-black flex justify-center items-center">
      <form className="max-w-md" onSubmit={handleSubmit} name="addIconForm">
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
            required
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
            required
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
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={pending}
        >
          {pending ? "Adding Icon..." : "Add Icon"}
        </button>
      </form>
    </div>
  );
}
