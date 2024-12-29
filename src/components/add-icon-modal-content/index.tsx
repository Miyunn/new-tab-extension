import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";
import ManualIconTab from "./components/manual-form";
import IconLibrary from "./components/library";

export default function AddIconForm({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Library");

  const [pending, setPending] = useState(false);

  const [useIconURLToggle, setUseIconURLToggle] = useState(false);
  const handleUseIconURLToggle = () => {
    setUseIconURLToggle(!useIconURLToggle);
    setError("");
  };

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
  };

  const clearForm = () => {
    const form = document.querySelector(
      "form[name='addIconForm']",
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }
    setError("");
  };

  const imageUploadValidation = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      setError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setPending(true);

    const formData = new FormData(event.currentTarget);

    const newIcon = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      iconURL: formData.get("iconURL") as String,
    };

    //@ts-ignore
    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    if (!useIconURLToggle) {
      const iconImage = formData.get("iconUpload") as File;
      if (iconImage && iconImage.size > 0) {
        try {
          newIcon.iconURL = await new Promise<string>((resolve, reject) => {
            if (
              iconImage.type.startsWith("image/") &&
              iconImage.size < 3 * 1024 * 1024
            ) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };

              reader.onerror = () => {
                reject(new Error("Error reading file"));
              };
              reader.readAsDataURL(iconImage);
            } else {
              reject(new Error("Invalid file type or size"));
            }
          });
        } catch {
          setError("Error reading file");
          setPending(false);
          return;
        }
      }
    }

    try {
      //@ts-ignore
      await db.icons.add({
        id: crypto.randomUUID(),
        name: newIcon.name,
        src: newIcon.iconURL,
        url: newIcon.destination,
        position: newPosition,
      });
      setPending(false);
      closeDrawer();
      clearForm();
    } catch (error) {
      setError("Error adding icon");
      setPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md">
        <div className="divider text-sm">Add Icon</div>

        <div role="tablist" className="tabs tabs-lifted w-full max-w-md">
          <a
            role="tab"
            className={`tab w-full ${activeTab === "Library" ? "tab-active" : ""}`}
            onClick={() => handleTabSwitch("Library")}
          >
            Library
          </a>
          <a
            role="tab"
            className={`tab w-full ${activeTab === "Manual" ? "tab-active" : ""}`}
            onClick={() => handleTabSwitch("Manual")}
          >
            Manual
          </a>
        </div>
        {activeTab === "Manual" && (
          <ManualIconTab
            handleSubmit={handleSubmit}
            imageUploadValidation={imageUploadValidation}
            setError={setError}
            error={error}
            pending={pending}
            handleUseIconURLToggle={handleUseIconURLToggle}
            useIconURLToggle={useIconURLToggle}
          />
        )}
        {activeTab === "Library" && <IconLibrary />}
      </div>
    </div>
  );
}
