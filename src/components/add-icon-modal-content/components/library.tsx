import { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";

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
  const [visibleIconId, setVisibleIconId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchIconsFromLibrary = async (searchTerm: string = "") => {
    try {
      const response = await fetch(
        `https://newtab-backend-proxy.vercel.app/api/getIcons?search=${searchTerm}`,
      );
      const data = await response.json();
      setIcons(data);
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

  useEffect(() => {
    if (searchQuery) {
      fetchIconsFromLibrary(searchQuery);
    } else {
      fetchIconsFromLibrary();
    }
  }, [searchQuery]);

  return (
    <div>
      <form className="mt-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for an icon..."
          value={searchQuery}
          className="input input-bordered w-full"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="flex items-center justify-center mt-6">
        {loading && (
          <span className="loading loading-spinner loading-lg mt-10"></span>
        )}
        {error && (
          <p className="text-red-500">
            Failed to load icons. Please try again.
          </p>
        )}
        {!loading && !error && icons.length === 0 && (
          <p className="text-gray-500">No icons found for "{searchQuery}".</p>
        )}
        {!loading && icons.length > 0 && (
          <div className="grid grid-cols-4 gap-8">
            {icons.map((icon) => (
              <div className="indicator" key={icon.id}>
                <button
                  data-tooltip-id={`tooltip-${icon.id}`}
                  className="flex flex-col bg-gray-700 items-center p-2 rounded-lg hover:shadow-lg hover:bg-gray-400 transition"
                  onClick={() => {
                    handleLibraryAdd(icon);
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setVisibleIconId(icon.id);
                    timeoutRef.current = setTimeout(() => {
                      setVisibleIconId(null);
                    }, 3000);
                  }}
                >
                  {visibleIconId === icon.id && (
                    <span className="indicator-item indicator-center indicator-middle badge ">
                      Added
                    </span>
                  )}
                  <img
                    src={icon.icon}
                    alt={icon.name}
                    className="w-10 h-10 object-contain"
                  />
                </button>

                <Tooltip
                  id={`tooltip-${icon.id}`}
                  className="z-50"
                  delayShow={150}
                >
                  <div className="text-left text-sm p-1">
                    <div>
                      <span className="font-semibold text-gray-100">Name:</span>{" "}
                      <span className="text-gray-300">{icon.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-100">URL:</span>{" "}
                      <span className="text-gray-300">{icon.url}</span>
                    </div>
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>
      {!loading && icons.length > 0 && (
        <p className="text-gray-500 mt-6">
          Adding more icons as we speak — thanks for sticking around! ❤️
        </p>
      )}
    </div>
  );
}
