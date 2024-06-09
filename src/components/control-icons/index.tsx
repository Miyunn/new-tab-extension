import { FiSettings, FiPlusSquare } from "react-icons/fi";

export default function ControlIcons() {
  return (
    <div className="fixed top-0 right-0 z-50 m-4 flex flex-col space-y-2">
      <div className="tooltip tooltip-left" data-tip="Add Icons">
        <button>
          <FiPlusSquare />
        </button>
      </div>

      <div className="tooltip tooltip-left" data-tip="Settings">
        <button
          onClick={() => {
            const modal = document.getElementById(
              "SettingsModal",
            ) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          <FiSettings />
        </button>
      </div>
    </div>
  );
}
