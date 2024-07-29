// TODO : add warning message and success message for import

import IDBExportImport from "indexeddb-export-import";
import db from "../../../database/indexDb";

export default function BackupAndRestore() {
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
              a.download = `new-tab-userData-backup-${exportTime.toString()}.json`;
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
    db.open()
      .then(() => {
        const idbDatabase = db.backendDB();
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonString = event.target?.result;
          IDBExportImport.clearDatabase(idbDatabase, (err: Error | null) => {
            if (err) {
              console.error("Clear database failed: ", err);
            } else {
              console.log("Database cleared successfully");
              IDBExportImport.importFromJsonString(
                idbDatabase,
                jsonString,
                (err: Error) => {
                  if (err) {
                    console.error("Import failed: ", err);
                  } else {
                    console.log("Imported data successfully");
                    // window.location.reload();
                    // The reload code here sometimes breaks the import, have to find a different solution
                  }
                },
              );
            }
          });
        };
        reader.readAsText(file);
      })
      .catch((e) => {
        console.error("Could not connect: ", e);
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
      <div className="divider text-sm">Backup And Restore</div>
      <div className="flex w-full max-w">
        <button
          type="button"
          onClick={backupIcons}
          className="btn btn-outline flex-grow mr-2"
        >
          Backup Icons
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="btn btn-outline w-1/2 ml-2"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Import Icons
        </button>
      </div>
    </>
  );
}
