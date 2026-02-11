import { FiPlus as AddIcon } from "react-icons/fi";

interface Props {
  heightWidth: number;
  labels: boolean;
  showAddIconDrawer: () => void;
  iconBackground: boolean;
  iconBackgroundColor: string;
  iconBackgroundOpacity: number;
  iconBackgroundRadius: number;
}

export default function AddNewIcon({
  heightWidth,
  labels,
  showAddIconDrawer,
  iconBackground,
  iconBackgroundColor,
  iconBackgroundOpacity,
  iconBackgroundRadius,
}: Props) {
  const backgroundStyle = iconBackground
    ? {
        backgroundColor: `rgba(${parseInt(iconBackgroundColor.slice(1, 3), 16)}, ${parseInt(
          iconBackgroundColor.slice(3, 5),
          16,
        )}, ${parseInt(iconBackgroundColor.slice(5, 7), 16)}, ${iconBackgroundOpacity})`,
        borderRadius: `${iconBackgroundRadius}%`,
      }
    : {};

  return (
    <div className="icon flex flex-col items-center">
      <div
        className="flex items-center justify-center hoverIcon"
        style={{
          height: `${heightWidth}px`,
          width: `${heightWidth}px`,
          borderRadius: "50%",
          padding: "4px",
          ...backgroundStyle,
        }}
        onClick={showAddIconDrawer}
      >
        <AddIcon size={heightWidth - 12} color="#AAAAAA" />
      </div>
      {labels && (
        <p
          className="mt-1.5 text-xs text-center text-gray-400 truncate"
          style={{ maxWidth: "75px" }}
        >
          Add Icons
        </p>
      )}
    </div>
  );
}
