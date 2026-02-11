//TODO:Save images as blobs instead of base64

import { useState, useEffect } from "react";
import db from "../../../database/indexDb";
import { IconData } from "../../../types/iconData";
import { Upload, UploadProps, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { FiPlusSquare } from "react-icons/fi";
import { RcFile } from "antd/es/upload";
import { checkImageURL } from "../../../utils/imageValidation";

interface Props {
  selectedIcon: IconData;
  setEditIconModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBlockingSave: boolean;
  setIsBlockingSave: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditIconForm({
  selectedIcon,
  setEditIconModalOpen,
  isBlockingSave,
  setIsBlockingSave,
}: Props) {
  const [tempIconName, setTempIconName] = useState<string | null>(null);
  const [tempIconSrc, setTempIconSrc] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string>("");
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [iconUrlError, setIconUrlError] = useState(false);

  useEffect(() => {
    setTempIconName(selectedIcon.name);
    setTempIconSrc(selectedIcon.src);
  }, [selectedIcon]);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Invalid file type");
      return Upload.LIST_IGNORE;
    }

    if (file.size > 2 * 1024 * 1024) {
      message.error("File size must be less than 2MB");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const props: UploadProps = {
    name: "image",
    multiple: false,
    showUploadList: true,
    fileList,
    onRemove: () => {
      setTempIconSrc(selectedIcon.src);
      setFileList([]);
      setIconUrlError(false);
    },
    beforeUpload,
    customRequest: ({ file }) => {
      const f = file as File;

      const blobUrl = URL.createObjectURL(f);
      setIconUrl("");
      setIconUrlError(false);
      setTempIconSrc(blobUrl);
      setFileList([f as RcFile]);
    },
    onChange(info) {
      console.log(info.file, info.fileList);
    },
  };

  const handleUrlIconValidation = async (url: string) => {
    const isValid = await checkImageURL(url);
    if (!isValid) {
      setTempIconSrc(selectedIcon.src);
      setFileList([]);
      setIconUrlError(true);
      return;
    }
    setFileList([]);
    setTempIconSrc(url);
    setIconUrlError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isBlockingSave) return;
    setIsBlockingSave(true);

    if (!tempIconSrc) {
      message.error("You must upload an image or provide a URL.");
      setIsBlockingSave(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const updatedIcon = {
      name: (formData.get("name") as string).trim(),
      destination: (formData.get("destination") as string).trim(),
      iconSrc: tempIconSrc,
    };

    let finalIconSrc = updatedIcon.iconSrc;

    if (finalIconSrc.startsWith("blob:")) {
      try {
        const response = await fetch(finalIconSrc);
        const blob = await response.blob();

        finalIconSrc = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err: any) {
        message.error(err.message || "Error updating icon");
        setIsBlockingSave(false);
        return;
      }
    }

    try {
      await db.icons.update(selectedIcon.id, {
        name: updatedIcon.name,
        src: finalIconSrc,
        url: updatedIcon.destination,
      });

      setEditIconModalOpen(false);
    } catch (error) {
      message.error("Error updating icon");
    } finally {
      setIsBlockingSave(false);
    }
  };

  useEffect(() => {
    if (!iconUrl) {
      setIconUrlError(false);
      return;
    }

    setIsBlockingSave(true);

    const timer = setTimeout(async () => {
      await handleUrlIconValidation(iconUrl);

      setIsBlockingSave(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [iconUrl]);

  // cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (tempIconSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(tempIconSrc);
      }
    };
  }, [tempIconSrc]);

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
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          className={`input ${
            iconUrlError
              ? "border-red-500 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
              : ""
          }`}
        />
        {iconUrlError && (
          <span className="text-xs text-red-500 mt-2">
            That link doesn't look like an image. We'll stick with your original
            icon for now.
          </span>
        )}
      </div>
    </form>
  );
}
