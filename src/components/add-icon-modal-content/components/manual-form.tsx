import { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";
import { generateLetterAvatar } from "../../../utils/faviconResolver";

export default function ManualIconTab({
  handleSubmit,
  imageUploadValidation,
  error,
  pending,
  useIconURLToggle,
  handleUseIconURLToggle,
}: {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  imageUploadValidation: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
  useIconURLToggle: boolean;
  handleUseIconURLToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  pending: boolean;
}) {
  const [nameInput, setNameInput] = useState("");
  const [iconUrlInput, setIconUrlInput] = useState("");
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    imageUploadValidation(event);
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);
      setImgError(false);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleReset = () => {
    setNameInput("");
    setIconUrlInput("");
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    setImgError(false);
  };

  const effectivePreviewSrc = useIconURLToggle
    ? iconUrlInput.trim()
    : filePreviewUrl;

  return (
    <form
      className="max-w-md"
      onSubmit={handleSubmit}
      onReset={handleReset}
      name="addIconForm"
    >
      {/* Icon Preview */}
      <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-xl mb-4 border border-gray-700/50 mt-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-700/60 flex items-center justify-center p-2 shadow-inner">
          {effectivePreviewSrc && !imgError ? (
            <img
              src={effectivePreviewSrc}
              alt={nameInput || "Icon preview"}
              className="w-10 h-10 object-contain rounded-md"
              onError={() => setImgError(true)}
            />
          ) : nameInput.trim() ? (
            <img
              src={generateLetterAvatar(nameInput.trim())}
              alt={nameInput}
              className="w-10 h-10 object-contain rounded-md"
            />
          ) : (
            <FiImage className="text-2xl text-gray-400" />
          )}
        </div>
        <span className="mt-2 text-sm font-medium text-gray-200 truncate max-w-[220px]">
          {nameInput.trim() || "Shortcut Preview"}
        </span>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Icon label"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
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
            onChange={(e) => {
              setImgError(false);
              handleUseIconURLToggle(e);
            }}
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
            value={iconUrlInput}
            onChange={(e) => {
              setImgError(false);
              setIconUrlInput(e.target.value);
            }}
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
            onChange={handleFileChange}
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
  );
}
