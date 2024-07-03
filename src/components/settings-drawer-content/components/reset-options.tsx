interface ResetOptionSettingsProps {
  resetSettings: () => void;
}
export default function ResetOptionSettings({
  resetSettings,
}: ResetOptionSettingsProps) {
  return (
    <>
      <div className="divider text-sm">Reset</div>
      <div className="flex w-full max-w ">
        <button
          type="button"
          onClick={resetSettings}
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
