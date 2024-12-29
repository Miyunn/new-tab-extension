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
  return (
    <form className="max-w-md" onSubmit={handleSubmit} name="addIconForm">
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
  );
}
