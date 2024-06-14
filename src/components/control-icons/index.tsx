import { FiSettings, FiPlusSquare } from "react-icons/fi";

export default function ControlIcons({
  showDrawer,
  showAddIconDrawer,
}: {
  showDrawer: () => void;
  showAddIconDrawer: () => void;
}) {
  return (
    <div className="fixed top-0 right-0 z-50 m-4 flex flex-col space-y-2">
      <div className="tooltip tooltip-left" data-tip="Add Icons">
        <button onClick={showAddIconDrawer}>
          <FiPlusSquare size={16} />
        </button>
      </div>

      <div className="tooltip tooltip-left" data-tip="Settings">
        <button onClick={showDrawer}>
          <FiSettings size={16} />
        </button>
      </div>
    </div>
  );
}
