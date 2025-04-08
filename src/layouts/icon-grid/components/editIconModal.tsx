import { useState, useEffect } from "react";
import db from "../../../database/indexDb";
import { IconData } from "../../../types/iconData";

interface Props {
  selectedIcon: IconData;
  closeModal: () => void;
}

export default function EditIconForm({ selectedIcon, closeModal }: Props) {
  const [useUrlForIconToggle, setUseUrlForIconToggle] = useState(
    !!selectedIcon.src,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedIcon.src && selectedIcon.src.startsWith("data:")) {
      setUseUrlForIconToggle(false);
    }
  }, [selectedIcon]);

  const handleUseIconURLToggle = () => {
    setUseUrlForIconToggle((prev) => !prev);
    setError("");
  };

  const clearForm = () => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const updatedIcon = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      iconURL: selectedIcon.src,
    };

    if (!useUrlForIconToggle) {
      const iconImage = formData.get("iconUpload") as File;
      if (iconImage && iconImage.size > 0) {
        try {
          updatedIcon.iconURL = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error reading file"));
            reader.readAsDataURL(iconImage);
          });
        } catch {
          setError("Error reading file");
          setPending(false);
          return;
        }
      }
    } else {
      updatedIcon.iconURL = formData.get("iconURL") as string;
    }

    try {
      // @ts-ignore
      await db.icons.update(selectedIcon.id, {
        name: updatedIcon.name,
        src: updatedIcon.iconURL,
        url: updatedIcon.destination,
      });
      setPending(false);
      clearForm();
      closeModal();
    } catch (error) {
      setError("Error updating icon");
      setPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        className="max-w-md w-full"
        onSubmit={handleSubmit}
        name="editIconForm"
      >
        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Icon label"
            defaultValue={selectedIcon.name}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mt-3">
          <label className="label">
            <span className="label-text">Destination</span>
          </label>
          <input
            type="text"
            name="destination"
            placeholder="Destination URL"
            defaultValue={selectedIcon.url}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control w-full mt-3">
          <label className="label cursor-pointer">
            <span className="label-text">Use Image URL for Icon</span>
            <input
              type="checkbox"
              className="toggle toggle-primary ml-2"
              checked={useUrlForIconToggle}
              onChange={handleUseIconURLToggle}
            />
          </label>
        </div>

        {useUrlForIconToggle ? (
          <div className="form-control w-full mt-2">
            <label className="label">
              <span className="label-text">Icon URL</span>
            </label>
            <input
              type="text"
              name="iconURL"
              placeholder="Image URL here"
              defaultValue={
                selectedIcon.src.startsWith("data:") ? "" : selectedIcon.src
              }
              className="input input-bordered"
              required
            />
          </div>
        ) : (
          <div className="form-control w-full mt-2">
            <label className="label">
              <span className="label-text">Upload new Icon</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              name="iconUpload"
              onChange={imageUploadValidation}
              required={selectedIcon.src === ""}
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary mt-5 mb-3 w-full"
          disabled={pending || error !== ""}
        >
          {pending ? "Saving Icon..." : "Save Icon"}
        </button>
      </form>
    </div>
  );
}
