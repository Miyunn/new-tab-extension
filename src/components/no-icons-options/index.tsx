import { FiPlusSquare as Icon } from "react-icons/fi";

export default function NoIconOptions({
  showAddIconDrawer,
}: {
  showAddIconDrawer: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="tooltip tooltip-bottom mt-8">
        <button onClick={showAddIconDrawer}>
          <Icon size={35} />
        </button>
      </div>
      <p className="text-sm text-center text-slate-300 mt-2">
        Looks a bit empty here. Click the plus button to add icons.
      </p>
      <p className="text-sm text-center text-slate-400 mt-2">
        Don’t want to see this message? You can hide it in Settings by turning
        off “Show Icons.”
      </p>
    </div>
  );
}
