// FIX: fix the issues with unexpected error handling

import IDBExportImport from "indexeddb-export-import";
import db from "../../../database/indexDb";
import { useState } from "react";

export default function BackupAndRestore() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backupIcons = () => {
    db.open()
      .then(() => {
        const idbDatabase = db.backendDB();

        IDBExportImport.exportToJsonString(
          idbDatabase,
          (err: Error, jsonString: any) => {
            if (err) {
              console.error("Export failed: ", err);
            } else {
              console.log("Exported as JSON: ", jsonString);
              // Download the JSON string as a file
              const blob = new Blob([jsonString], { type: "application/json" });
              const exportTime = new Date(Date.now());
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `new-tab-backup-${exportTime.toString()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }
          },
        );
      })
      .catch((e) => {
        console.error("Could not connect: ", e);
      });
  };

  const importIcons = (file: File) => {
    setBusy(true);
    setError(null);

    if (file.type !== "application/json") {
      const errorMessage = "Invalid file type. Please upload a JSON file.";
      console.error(errorMessage);
      setError(errorMessage);
      setBusy(false);
      return;
    }

    db.open()
      .then(() => {
        const idbDatabase = db.backendDB();
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result;

            IDBExportImport.clearDatabase(idbDatabase, (err: Error | null) => {
              if (err) {
                const errorMessage = "Clear database failed: " + err.message;
                console.error(errorMessage);
                setError(errorMessage);
                setBusy(false);
              } else {
                console.log("Database cleared successfully");
                IDBExportImport.importFromJsonString(
                  idbDatabase,
                  jsonString,
                  (err: Error) => {
                    if (err) {
                      const errorMessage = "Import failed: " + err.message;
                      console.error(errorMessage);
                      setError(errorMessage);
                      setBusy(false);
                    } else {
                      console.log("Imported data successfully");
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000); // A 2 sec buffer is set before the page reloads to ensure index db gets updated safely
                    }
                  },
                );
              }
            });
          } catch (error) {
            const errorMessage =
              "Error processing file: " + (error as Error).message;
            console.error(errorMessage);
            setError(errorMessage);
            setBusy(false);
          }
        };

        reader.onerror = () => {
          const errorMessage = "File reading failed: ";
          console.error(errorMessage);
          setError(errorMessage);
          setBusy(false);
        };

        reader.readAsText(file);
      })
      .catch((e) => {
        const errorMessage = "Could not connect: " + e.message;
        console.error(errorMessage);
        setError(errorMessage);
        setBusy(false);
      });
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      importIcons(file);
    }
  };
  return (
    <>
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
                Importing will override all existing data, are you sure you want
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

      <div className="divider text-sm">Backup And Restore</div>
      <div className="flex w-full max-w">
        <button
          type="button"
          onClick={backupIcons}
          className="btn btn-outline flex-grow mr-2"
        >
          Save Backup
        </button>
        <button
          type="button"
          className="btn btn-outline w-1/2 ml-2"
          onClick={() => {
            const modal = document.getElementById(
              "import_icon_modal",
            ) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Restore
        </button>
      </div>
    </>
  );
}
