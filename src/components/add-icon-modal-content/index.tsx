import { useState } from "react";
import "./styles.css";
import db from "../../database/indexDb";
import ManualIconTab from "./components/manual-form";
import IconLibrary from "./components/library";
import QuickAdd from "./components/quick-add";
import { urlToBase64 } from "../../utils/imageConversion";
import { formatDestinationUrl } from "../../utils/url";
import { IconFormData } from "../icon-form";

export default function AddIconForm({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Quick Add");

  const handleTabSwitch = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleLibraryAdd = async (icon: {
    id: string;
    name: string;
    icon: string;
    url: string;
  }) => {
    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    const base64Src = await urlToBase64(icon.icon);

    await db.icons.add({
      id: crypto.randomUUID(),
      name: icon.name,
      src: base64Src,
      url: formatDestinationUrl(icon.url),
      position: newPosition,
    });
  };

  const handleManualSubmit = async (data: IconFormData) => {
    const highestPositionIcon = await db.icons.orderBy("position").last();
    const newPosition = highestPositionIcon
      ? highestPositionIcon.position + 1
      : 0;

    await db.icons.add({
      id: crypto.randomUUID(),
      name: data.name,
      src: data.src,
      url: data.destination,
      position: newPosition,
    });

    closeDrawer();
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="divider text-sm">Add Icon</div>
        <div role="tablist" className="tabs tabs-lifted mb-2">
          <a
            role="tab"
            className={`tab ${activeTab === "Quick Add" ? "tab-active" : ""}`}
            onClick={() => handleTabSwitch("Quick Add")}
          >
            Quick Add
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "Library" ? "tab-active" : ""}`}
            onClick={() => handleTabSwitch("Library")}
          >
            Library
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "Manual" ? "tab-active" : ""}`}
            onClick={() => handleTabSwitch("Manual")}
          >
            Manual
          </a>
        </div>
        {activeTab === "Quick Add" && (
          <QuickAdd closeDrawer={closeDrawer} />
        )}
        {activeTab === "Manual" && (
          <ManualIconTab onSubmit={handleManualSubmit} />
        )}
        {activeTab === "Library" && (
          <IconLibrary handleLibraryAdd={handleLibraryAdd} />
        )}
      </div>
    </div>
  );
}
