import { FiPlusSquare } from "react-icons/fi";

export default function NoIconOptions({
  showAddIconDrawer,
}: {
  showAddIconDrawer: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="tooltip tooltip-bottom mt-10">
        <button onClick={showAddIconDrawer}>
          <FiPlusSquare size={35} />
        </button>
      </div>
      <p className="text-sm text-center">Add icon</p>
      <p className="text-sm text-center text-slate-500 mt-2">
        Hide this message by disabling "Show Icons" from the settings menu
        {/* TODO: Disable icons by pressing the button, maybe add a modal confirmation*/}
      </p>
    </div>
  );
}
