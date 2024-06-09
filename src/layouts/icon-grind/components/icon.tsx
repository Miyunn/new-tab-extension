import { ReactNode } from "react";
interface Props {
  iconName: string;
  children: ReactNode;
  url: string;
  labels: boolean;
}
const Icon = ({ iconName, children, url, labels }: Props) => {
  const handleIconClick = () => {
    window.location.href = url;
  };

  return (
    <div className="icon flex flex-col items-center">
      <a
        aria-label={iconName}
        className="flex flex-col items-center"
        onClick={handleIconClick}
      >
        <div className="rounded-full items-center justify-center">
          {children}
        </div>
        {labels && (
          <p
            className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400 truncate"
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
