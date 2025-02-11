import { useState, useEffect } from "react";

interface Icon {
  id: string;
  name: string;
  icon: string;
  url: string;
}

interface IconLibraryProp {
  handleLibraryAdd: (Icon: Icon) => void;
}

export default function IconLibrary({ handleLibraryAdd }: IconLibraryProp) {
  const [loading, setLoading] = useState(true);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [error, setError] = useState(false);

  const fetchIconsFromLibrary = async () => {
    try {
      const response = await fetch(
        `https://newtab-backend-proxy.vercel.app/api/getIcons`,
      );
      const data = await response.json();
      setIcons(data.icons);
      setLoading(false);
    } catch (err) {
      console.error("Could not fetch icons", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIconsFromLibrary();
  }, []);

  return (
    <div className="max-w-md">
      <form>
        <label className="input input-bordered flex items-center gap-2 mt-4">
          <input type="text" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </form>

      <div className="flex items-center justify-center mt-10">
        {loading && <span className="loading loading-bars loading-lg"></span>}
        {error && (
          <p className="text-red-500">
            Failed to load icons. Please try again.
          </p>
        )}
        {!loading && !error && icons.length === 0 && (
          <p className="text-gray-500">No icons available.</p>
        )}
        {!loading && icons.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {icons.map((icon) => (
              <button
                key={icon.id}
                className="flex flex-col items-center p-2 rounded-lg hover:shadow-lg hover:bg-gray-400 transition"
                onClick={() => handleLibraryAdd(icon)}
              >
                <img
                  src={icon.icon}
                  alt={icon.name}
                  className="w-10 h-10 object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
