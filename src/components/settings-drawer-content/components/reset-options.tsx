// NOTE: Might want to replace with a antd modal or a custom modal
//
interface ResetOptionSettingsProps {
  resetSettings: () => void;
}
export default function ResetOptionSettings({
  resetSettings,
}: ResetOptionSettingsProps) {
  return (
    <>
      <dialog id="reset_confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reset Settings</h3>
          <p className="py-4">
            No Icons will be removed, but all settings will be reset to default.
            Are you sure you want to reset?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-error flex-grow mr-2"
                onClick={resetSettings}
              >
                Reset
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="divider text-sm">Reset</div>
      <div className="flex w-full max-w ">
        <button
          type="button"
          onClick={() => {
            const modal = document.getElementById(
              "reset_confirm_modal",
            ) as HTMLDialogElement;
            modal.showModal();
          }}
          className="btn btn-outline btn-error flex-grow mr-2"
        >
          Reset Settings
        </button>
        <button
          type="button"
          className="btn btn-outline btn-error w-1/2  ml-2"
          disabled
        >
          Remove Icons
        </button>
      </div>
    </>
  );
}
