import { useState, useEffect } from "react";
import db from "../../../database/indexDb";
import { IconData } from "../../../types/iconData";
import { UploadProps, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { FiPlusSquare } from "react-icons/fi";

interface Props {
  selectedIcon: IconData;
  setEditIconModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const props: UploadProps = {
  name: "image",
  multiple: false,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

export default function EditIconForm({
  selectedIcon,
  setEditIconModalOpen,
}: Props) {
  const [useUrlForIconToggle, setUseUrlForIconToggle] = useState(
    !!selectedIcon.src,
  );

  const [tempIconName, setTempIconName] = useState<string | null>(null);
  const [tempIconSrc, setTempIconSrc] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedIcon.src && selectedIcon.src.startsWith("data:")) {
      setUseUrlForIconToggle(false);
    }
    setTempIconName(selectedIcon.name);
    setTempIconSrc(selectedIcon.src);
  }, [selectedIcon]);

  const handleUseIconURLToggle = () => {
    setUseUrlForIconToggle((prev) => !prev);
    setError("");
  };

  const clearForm = () => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedIcon = {
      name: formData.get("name") as string,
      destination: formData.get("destination") as string,
      iconURL: selectedIcon.src,
    };

    if (!useUrlForIconToggle) {
      const iconImage = formData.get("iconUpload") as File;
      if (iconImage && iconImage.size > 0) {
        try {
          updatedIcon.iconURL = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error reading file"));
            reader.readAsDataURL(iconImage);
          });
        } catch {
          setError("Error reading file");
          return;
        }
      }
    } else {
      updatedIcon.iconURL = formData.get("iconURL") as string;
    }

    try {
      await db.icons.update(selectedIcon.id, {
        name: updatedIcon.name,
        src: updatedIcon.iconURL,
        url: updatedIcon.destination,
      });
      clearForm();
      setEditIconModalOpen(false);
    } catch (error) {
      setError("Error updating icon");
    }
  };

  return (
    <form
      id="edit-icon-form"
      className="max-w-md w-full"
      onSubmit={handleSubmit}
      name="editIconForm"
    >
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        {tempIconSrc ? (
          <img src={tempIconSrc} className="w-[60px]" alt="" />
        ) : (
          <FiPlusSquare className="text-6xl text-gray-400" />
        )}
        <span className="text-center text-sm">
          {tempIconName || "Icon Name"}
        </span>
      </div>

      <div className="divider" />
      <div className="form-control space-y-3">
        <div className="flex items-center">
          <span className="label-text w-24">Name</span>
          <input
            type="text"
            name="name"
            placeholder="Icon label"
            defaultValue={selectedIcon.name}
            className="input flex-1"
            onChange={(e) => setTempIconName(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center">
          <span className="label-text w-24">Destination</span>
          <input
            type="text"
            name="destination"
            placeholder="Enter a valid URL"
            defaultValue={selectedIcon.url}
            className="input flex-1"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag an image here to upload your icon
          </p>
          <p className="ant-upload-hint">Maximum file size: 2MB</p>
        </Dragger>
      </div>

      <div className="divider"> Use image URL instead </div>
      <div className="form-control w-full">
        <input
          type="text"
          name="iconURL"
          placeholder="Image URL here"
          defaultValue={
            selectedIcon.src.startsWith("data:") ? "" : selectedIcon.src
          }
          onChange={(e) => setTempIconSrc(e.target.value)}
          className="input"
          required
        />
      </div>
      {/*
      <input
        type="file"
        name="iconUpload"
        onChange={imageUploadValidation}
        required={selectedIcon.src === ""}
      />
      <div>
      </div>
      */}
    </form>
  );
}
