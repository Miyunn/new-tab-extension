import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";

export default function AddIconForm({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) {
  const [useIconURLToggle, setUseIconURLToggle] = useState(false);

  const handleUseIconURLToggle = () => {
    setUseIconURLToggle(!useIconURLToggle);
    setError("");
  };

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const clearForm = () => {
    const form = document.querySelector(
      "form[name='addIconForm']",
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }
    setError("");
  };

  const imageUploadValidation = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      setError("");
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
      iconURL: formData.get("iconURL") as String,
    };

    //@ts-ignore
    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    if (!useIconURLToggle) {
      const iconImage = formData.get("iconUpload") as File;
      if (iconImage && iconImage.size > 0) {
        try {
          newIcon.iconURL = await new Promise<string>((resolve, reject) => {
            if (
              iconImage.type.startsWith("image/") &&
              iconImage.size < 3 * 1024 * 1024
            ) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };

              reader.onerror = () => {
                reject(new Error("Error reading file"));
              };
              reader.readAsDataURL(iconImage);
            } else {
              reject(new Error("Invalid file type or size"));
            }
          });
        } catch {
          setError("Error reading file");
          setPending(false);
          return;
        }
      }
    }

    try {
      //@ts-ignore
      await db.icons.add({
        id: crypto.randomUUID(),
        name: newIcon.name,
        src: newIcon.iconURL,
        url: newIcon.destination,
        position: newPosition,
      });
      setPending(false);
      closeDrawer();
      clearForm();
    } catch (error) {
      setError("Error adding icon");
      setPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
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
            placeholder="Destination URL"
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
              required
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
              name="iconUpload"
              onChange={imageUploadValidation}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={pending || (error !== "" ? true : false)}
        >
          {pending ? "Saving Icon..." : "Save Icon"}
        </button>
      </form>
    </div>
  );
}
