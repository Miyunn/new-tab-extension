interface Props {
  imageLink: string;
  artist: string;
  artistLink: string;
  profilePic: string;
  type: string;
}

export default function UnsplashCredits({
  artist,
  artistLink,
  profilePic,
  imageLink,
  type,
}: Props) {
  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

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
            href={imageLink}
            className="text-white no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {capitalizeFirstLetter(type)}{" "}
          </a>
          by{" "}
          <a
            href={artistLink}
            className="text-white no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {artist}
          </a>
        </div>
        <p className="text-xs text-gray-300">
          on{" "}
          <a
            href="https://unsplash.com/"
            className="no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}
