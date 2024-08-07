import { ReactNode } from "react";

interface Props {
  iconName: string;
  children: ReactNode;
  url: string;
  labels: boolean;
  height: number;
}

const Icon = ({ iconName, children, url, labels, height }: Props) => {
  const handleIconClick = (event: React.MouseEvent) => {
    if (event.button === 1) {
      // handle middle click to open in a new tab
      window.open(url, "_blank");
    } else if (event.button === 0) {
      window.location.href = url;
    }
  };

  return (
    <div className="icon flex flex-col items-center">
      <a
        aria-label={iconName}
        className="flex flex-col items-center"
        onMouseDown={handleIconClick}
      >
        <div
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          {children}
        </div>
        {labels && (
          <p
            className="mt-1.5 text-xs text-center text-gray-500 dark:text-gray-400 truncate"
            style={{ maxWidth: "75px" }}
          >
            {iconName}
          </p>
        )}
      </a>
    </div>
  );
};

export default Icon;
