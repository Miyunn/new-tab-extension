import IDBExportImport from "indexeddb-export-import";
import db from "../../../database/indexDb";
import { useState } from "react";

export default function BackupAndRestore() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) importIcons(file);
  };

  const backupIcons = async () => {
    try {
      await db.open();
      const idbDatabase = db.backendDB();

      IDBExportImport.exportToJsonString(
        idbDatabase,
        (err: Error, jsonString: any) => {
          if (err) {
            console.error("Export failed: ", err);
            return;
          }

          const blob = new Blob([jsonString], { type: "application/json" });
          const exportTime = new Date().toISOString();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `new-tab-backup-${exportTime}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
      );
    } catch (e) {
      console.error("Could not connect: ", e);
    }
  };

  const importIcons = async (file: File) => {
    setBusy(true);
    setError(null);

    if (file.type !== "application/json") {
      setError("Invalid file type. Please upload a JSON file.");
      setBusy(false);
      return;
    }

    try {
      await db.open();
      const idbDatabase = db.backendDB();
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonString = reader.result as string;

          IDBExportImport.clearDatabase(idbDatabase, (clearErr: any) => {
            if (clearErr) {
              setError("Clear database failed: " + clearErr.message);
              setBusy(false);
              return;
            }

            IDBExportImport.importFromJsonString(
              idbDatabase,
              jsonString,
              (importErr: Error) => {
                if (importErr) {
                  setError("Import failed: " + importErr.message);
                  setBusy(false);
                } else {
                  setTimeout(() => window.location.reload(), 2000);
                }
              },
            );
          });
        } catch (parseErr) {
          setError("Error processing file: " + (parseErr as Error).message);
          setBusy(false);
        }
      };

      reader.onerror = () => {
        setError("File reading failed");
        setBusy(false);
      };

      reader.readAsText(file);
    } catch (e) {
      setError("Could not connect: " + (e as Error).message);
      setBusy(false);
    }
  };

  const resetSettings = () => {
    localStorage.removeItem("settings");
    window.location.reload();
  };

  return (
    <div className="mt-6">
      {/* Import Modal */}
      <dialog id="import_icon_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Restore Data</h3>
          {busy ? (
            <div className="flex items-center justify-center h-full my-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <p className="py-4">
                Importing will override all existing data. Are you sure you want
                to continue?
              </p>
              {error && <p className="text-red-500 py-2">{error}</p>}
            </>
          )}
          <div className="modal-action">
            <form method="dialog">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="application/json"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn btn-primary flex-grow mr-2"
                onClick={() => document.getElementById("fileInput")?.click()}
                disabled={busy}
              >
                Select File
              </button>
              <button className="btn" disabled={busy}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Reset Modal */}
      <dialog id="reset_confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reset Settings</h3>
          <p className="py-4">
            Are you sure you want to reset all settings to default?
            <br />
            Your icons will stay as they are
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

      {/* Settings Menu Elements */}
      <div className="divider text-sm">Backup And Restore</div>
      <div className="flex w-full max-w">
        <button
          type="button"
          onClick={backupIcons}
          className="btn btn-outline flex-grow mr-2"
        >
          Export Icons
        </button>
        <button
          type="button"
          className="btn btn-outline w-1/2 ml-2"
          onClick={() => openModal("import_icon_modal")}
        >
          Restore Icons
        </button>
      </div>

      <div className="flex w-full max-w mt-4">
        <button
          type="button"
          className="btn btn-outline btn-error flex-grow mr-2"
          onClick={() => openModal("reset_confirm_modal")}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
