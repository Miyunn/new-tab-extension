import { useState, useEffect, useRef } from "react";
import db from "../../../database/indexDb";
import { resolveFavicon, ResolvedFavicon } from "../../../utils/faviconResolver";
import { urlToBase64 } from "../../../utils/imageConversion";
import { formatDestinationUrl } from "../../../utils/url";

interface QuickAddProps {
  closeDrawer: () => void;
}

export default function QuickAdd({ closeDrawer }: QuickAddProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolvedData, setResolvedData] = useState<ResolvedFavicon | null>(null);
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [previewFavicon, setPreviewFavicon] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced auto-resolution when inputUrl changes
  useEffect(() => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setResolvedData(null);
      setError("");
      setResolving(false);
      return;
    }

    // Require at least a dot or minimum domain structure before trying to resolve
    if (!trimmed.includes(".") && !trimmed.startsWith("http://localhost")) {
      setResolvedData(null);
      return;
    }

    setResolving(true);
    setError("");

    const timer = setTimeout(async () => {
      try {
        const result = await resolveFavicon(trimmed);
        setResolvedData(result);
        setName(result.name);
        setDestination(result.siteUrl);
        setPreviewFavicon(result.faviconUrl);
        setError("");
      } catch (err: unknown) {
        setResolvedData(null);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Could not resolve website URL");
        }
      } finally {
        setResolving(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [inputUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please provide an icon name");
      return;
    }

    const formattedDestination = formatDestinationUrl(destination);
    if (!formattedDestination) {
      setError("Please provide a destination URL");
      return;
    }

    if (!previewFavicon) {
      setError("No favicon available to save");
      return;
    }

    try {
      setPending(true);
      setError("");

      const highestPositionIcon = await db.icons.orderBy("position").last();
      const newPosition = highestPositionIcon ? highestPositionIcon.position + 1 : 0;

      // Convert favicon to base64 so it can be rendered reliably offline
      const base64Src = await urlToBase64(previewFavicon);

      await db.icons.add({
        id: crypto.randomUUID(),
        name: name.trim(),
        src: base64Src,
        url: formattedDestination,
        position: newPosition,
      });

      setPending(false);
      closeDrawer();
    } catch (err) {
      console.error("Error adding favicon icon:", err);
      setError("Failed to save icon to favorites");
      setPending(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Website URL</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. github.com, reddit.com"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="input input-bordered add-icon-form-input w-full pr-10"
          />
          {resolving && (
            <span className="loading loading-spinner loading-sm absolute right-3 top-3 text-primary"></span>
          )}
        </div>
        <label className="label">
          <span className="label-text-alt text-gray-400">
            Paste any URL to automatically fetch its icon and title
          </span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {resolvedData && (
        <form onSubmit={handleSubmit} className="mt-4 border-t border-gray-700/60 pt-4">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-xl mb-4 border border-gray-700/50">
            <div className="w-14 h-14 rounded-2xl bg-gray-700/60 flex items-center justify-center p-2 shadow-inner">
              <img
                src={previewFavicon}
                alt={name || "Favicon"}
                className="w-10 h-10 object-contain rounded-md"
                onError={() => {
                  // Fallback if image fails to render
                  if (name) {
                    setPreviewFavicon(
                      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="14" fill="%234A5568"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="bold" font-size="32" fill="white">${encodeURIComponent(
                        name.charAt(0).toUpperCase()
                      )}</text></svg>`
                    );
                  }
                }}
              />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-200 truncate max-w-[220px]">
              {name || "Shortcut Preview"}
            </span>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Icon label"
              className="input input-bordered add-icon-form-input w-full"
              required
            />
          </div>

          <div className="form-control mt-3">
            <label className="label">
              <span className="label-text">Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={() => {
                if (destination.trim()) {
                  setDestination(formatDestinationUrl(destination));
                }
              }}
              placeholder="Destination URL (e.g. www.google.com)"
              className="input input-bordered add-icon-form-input w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            disabled={pending || !name.trim() || !destination.trim()}
          >
            {pending ? "Saving Icons..." : "Save Icon"}
          </button>
        </form>
      )}
    </div>
  );
}
