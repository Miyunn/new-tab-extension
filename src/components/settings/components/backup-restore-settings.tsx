import IDBExportImport from "indexeddb-export-import";
import db from "../../../database/indexDb";
import { useState } from "react";
import { Settings } from "../../../types/settings";
import { Modal, Button, Popconfirm } from "antd";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import {
  DownloadOutlined,
  FileOutlined,
  RedoOutlined,
  SaveOutlined,
} from "@ant-design/icons";
interface BackupAndRestoreProps {
  settings: Settings;
}

export default function BackupAndRestore({ settings }: BackupAndRestoreProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(
    null,
  );

  const handleRestoreSettings = () => {
    if (!selectedBackupFile) {
      setError("Please select a backup file first.");
      return;
    }
    if (selectedBackupFile) restoreSettings(selectedBackupFile);
  };

  const backupIcons = async () => {
    try {
      await db.open();
      const idbDatabase = db.backendDB();

      const unsplashData = JSON.parse(
        localStorage.getItem("unsplashData") || "null",
      );

      IDBExportImport.exportToJsonString(
        idbDatabase,
        (err: Error, jsonString: string) => {
          if (err) {
            console.error("Export failed: ", err);
            return;
          }

          const backupPayload = {
            appVersion: "0.7.5",
            exportedAt: new Date().toISOString(),
            settings,
            indexedDB: JSON.parse(jsonString),
            unsplashData,
          };

          const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
            type: "application/json",
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `new-tab-backup-${backupPayload.exportedAt}.json`;
          a.click();
          URL.revokeObjectURL(url);
        },
      );
    } catch (e) {
      console.error("Could not connect: ", e);
    }
  };

  const restoreSettings = async (file: File) => {
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
          const backup = JSON.parse(reader.result as string);

          if (!backup.indexedDB || !backup.settings) {
            throw new Error("Invalid backup format");
          }

          // Restore settings
          localStorage.setItem("settings", JSON.stringify(backup.settings));

          // Restore Unsplash wallpaper
          localStorage.setItem(
            "unsplashData",
            JSON.stringify(backup.unsplashData),
          );

          // Restore IndexedDB
          IDBExportImport.clearDatabase(idbDatabase, (clearErr: Error) => {
            if (clearErr) {
              setError("Clear database failed: " + clearErr.message);
              setBusy(false);
              return;
            }

            IDBExportImport.importFromJsonString(
              idbDatabase,
              JSON.stringify(backup.indexedDB),
              (importErr: Error) => {
                if (importErr) {
                  setError("Import failed: " + importErr.message);
                  setBusy(false);
                } else {
                  setTimeout(() => window.location.reload(), 1000);
                }
              },
            );
          });
        } catch (err) {
          setError("Error processing file: " + (err as Error).message);
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

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".json",
    maxCount: 1,
    beforeUpload(file) {
      setSelectedBackupFile(file);
      setRestoreModalOpen(true);
      return false;
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const [RestoreModalOpen, setRestoreModalOpen] = useState(false);

  return (
    <div className="mt-6">
      {/* Import Modal */}
      <Modal
        title="Restore Backup"
        open={RestoreModalOpen}
        centered
        onCancel={() => {
          setRestoreModalOpen(false);
          setSelectedBackupFile(null);
          setError(null);
        }}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              type="primary"
              disabled={!selectedBackupFile}
              onClick={handleRestoreSettings}
            >
              Restore
            </Button>
          </>
        )}
        styles={{
          content: {
            backgroundColor: "rgba(0, 0, 0, 0.80)",
            backdropFilter: "blur(8px)",
            boxShadow: "none",
          },
          header: {
            backgroundColor: "transparent",
            borderBottom: "none",
          },
          body: {
            backgroundColor: "transparent",
          },
          footer: {
            backgroundColor: "transparent",
            borderTop: "none",
          },
          mask: {
            backdropFilter: "blur(4px)",
          },
        }}
      >
        {busy ? (
          <div className="flex items-center justify-center h-full my-8 color-white">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <FileOutlined />
              </p>
              <p className="ant-upload-text">
                Select or drag a backup file here to begin restoring your
                settings
              </p>
              <p className="ant-upload-hint">
                Upload a valid backup file in JSON (.json) format
              </p>
            </Dragger>
          </div>
        )}
        <>{error && <p className="text-red-500 py-2">{error}</p>}</>
      </Modal>
      {/* Settings Menu Elements */}
      <div className="divider text-sm">Backup And Restore</div>
      <div className="flex flex-col w-full gap-5">
        <button
          type="button"
          onClick={backupIcons}
          className="btn btn-outline w-full"
        >
          <SaveOutlined />
          Save Backup
        </button>

        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => setRestoreModalOpen(true)}
        >
          <DownloadOutlined />
          Import Backup
        </button>

        <Popconfirm
          title="Reset Settings"
          description="Are you sure you want to reset all settings to default?"
          okText="Reset"
          cancelText="Cancel"
          onConfirm={resetSettings}
          overlayClassName="glass-popconfirm"
          icon={null}
        >
          <button type="button" className="btn btn-outline btn-error w-full">
            <RedoOutlined />
            Reset Settings
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}
