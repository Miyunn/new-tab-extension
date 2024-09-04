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
}

const Icon = ({
  id,
  iconName,
  children,
  url,
  labels,
  height,
  draggable,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const handleIconClick = (event: React.MouseEvent) => {
    if (!draggable) {
      if (event.button === 1) {
        // handle middle click to open in a new tab
        window.open(url, "_blank");
      } else if (event.button === 0) {
        window.location.href = url;
      }
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="icon flex flex-col items-center"
      onMouseUpCapture={handleIconClick}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      draggable
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
    </div>
  );
};

export default Icon;
