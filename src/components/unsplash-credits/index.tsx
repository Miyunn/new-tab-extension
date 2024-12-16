import { useState } from "react";

interface Props {
  imageLink: string;
  artist: string;
  artistLink: string;
  profilePic: string;
  type: string;
  downloadLink: string;
}

export default function UnsplashCredits({
  artist,
  artistLink,
  profilePic,
  imageLink,
  type,
  downloadLink,
}: Props) {
  const [downloading, setDownloading] = useState(false);

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const createUTMUrl = (baseUrl: string, params: Record<string, string>) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = new URL(downloadLink);
      const pathnameParts = url.pathname.split("/");
      const photoId = pathnameParts[2];
      const ixid = url.searchParams.get("ixid");

      if (!photoId) {
        throw new Error("Missing photo ID in the download link.");
      }
      if (!ixid) {
        throw new Error("Missing ixid parameter in the download link.");
      }

      const apiUrl = `https://newtab-backend-proxy.vercel.app/api/downloadUnsplashImage?photoId=${encodeURIComponent(
        photoId,
      )}&ixid=${encodeURIComponent(ixid)}&filename=unsplash-image.jpg`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to download image. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `unsplash-${artist.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(imageUrl);
    } catch (error: any) {
      alert("There was an error downloading the image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const utmParams = {
    utm_source: "NewTab",
    utm_medium: "referral",
  };

  const utmImageLink = createUTMUrl(imageLink, utmParams);
  const utmArtistLink = createUTMUrl(artistLink, utmParams);

  return (
    <div className="m-4 flex items-center text-white max-w-xs">
      <div className="avatar flex-shrink-0 mr-3">
        <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={profilePic}
            alt={`Profile of ${artist}`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <div className="info">
        <div className="text-xs">
          <a
            href={utmImageLink}
            className="text-white no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {capitalizeFirstLetter(type)}{" "}
          </a>
          by{" "}
          <a
            href={utmArtistLink}
            className="text-white no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist}
          </a>
        </div>
        <div className="text-xs text-gray-300 space-x-1 flex items-center">
          on&nbsp;
          <a
            href="https://unsplash.com/"
            className="no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          <button
            onClick={handleDownload}
            className="no-underline hover:underline inline flex items-center text-white"
            disabled={downloading}
          >
            {downloading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="31.42"
                  strokeDashoffset="31.42"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cloud-arrow-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
