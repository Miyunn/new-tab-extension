import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

interface Props {
  id: string;
  iconName: string;
  children: ReactNode;
  url: string;
  labels: boolean;
  height: number;
  draggable: boolean;
  iconBackground: boolean;
  iconBackgroundColor: string;
  iconBackgroundOpacity: number;
  iconBackgroundRadius: number;
}

const Icon = ({
  id,
  iconName,
  children,
  url,
  labels,
  height,
  draggable,
  iconBackground,
  iconBackgroundColor,
  iconBackgroundOpacity,
  iconBackgroundRadius,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !draggable });

  const handleIconClick = (event: React.MouseEvent) => {
    if (isDragging) return;

    if (event.button === 1) {
      window.open(url, "_blank");
    } else if (event.button === 0) {
      window.location.href = url;
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "pointer",
  };

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
    <div
      className="icon flex flex-col items-center"
      ref={setNodeRef}
      {...attributes}
      {...(draggable ? listeners : {})}
      onClick={handleIconClick} // no conditional needed now
      style={style}
      draggable
    >
      <div
        className="flex items-center justify-center hoverIcon"
        style={{
          height: `${height}px`,
          width: `${height}px`,
          borderRadius: "50%",
          padding: "4px",
          ...backgroundStyle,
        }}
      >
        {children}
      </div>
      {labels && (
        <p
          className="mt-1.5 text-xs text-center text-gray-400 truncate"
          style={{ maxWidth: "75px" }}
        >
          {iconName}
        </p>
      )}
    </div>
  );
};

export default Icon;
