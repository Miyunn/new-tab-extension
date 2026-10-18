import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";
import ManualIconTab from "./components/manual-form";
import IconLibrary from "./components/library";
import { blobToBase64, urlToBase64 } from "../../utils/imageConversion";

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

  const handleLibraryAdd = async (icon: {
    id: string;
    name: string;
    icon: string;
    url: string;
  }) => {
    try {
      setPending(true);
      const highestPositionIcon = await db.icons.orderBy("position").last();
      const newPosition = highestPositionIcon
        ? highestPositionIcon.position + 1
        : 0;

      // Convert online library icon URL to Base64
      const base64Src = await urlToBase64(icon.icon);

      await db.icons.add({
        id: crypto.randomUUID(),
        name: icon.name,
        src: base64Src,
        url: icon.url,
        position: newPosition,
      });
      setPending(false);
    } catch {
      setError("Error adding icon from library");
      setPending(false);
    }
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
      name: (formData.get("name") as string).trim(),
      destination: (formData.get("destination") as string).trim(),
      iconURL: (formData.get("iconURL") as string)?.trim() || "",
    };

    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    let finalSrc = "";

    if (!useIconURLToggle) {
      const iconImage = formData.get("iconUpload") as File;
      if (iconImage && iconImage.size > 0) {
        try {
          if (
            iconImage.type.startsWith("image/") &&
            iconImage.size < 3 * 1024 * 1024
          ) {
            finalSrc = await blobToBase64(iconImage);
          } else {
            throw new Error("Invalid file type or size");
          }
        } catch {
          setError("Error reading file");
          setPending(false);
          return;
        }
      }
    } else {
      // User entered an image URL: convert it to Base64
      try {
        finalSrc = await urlToBase64(newIcon.iconURL);
      } catch {
        setError("Error processing image URL");
        setPending(false);
        return;
      }
    }

    try {
      await db.icons.add({
        id: crypto.randomUUID(),
        name: newIcon.name,
        src: finalSrc,
        url: newIcon.destination,
        position: newPosition,
      });
      setPending(false);
      closeDrawer();
      clearForm();
    } catch {
      setError("Error adding icon");
      setPending(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="divider text-sm">Add Icon</div>
        <div role="tablist" className="tabs tabs-lifted">
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
        {activeTab === "Library" && (
          <IconLibrary handleLibraryAdd={handleLibraryAdd} />
        )}
      </div>
    </div>
  );
}
