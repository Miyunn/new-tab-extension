import { useState, useEffect, useRef } from "react";
import { Upload, UploadProps, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { generateLetterAvatar } from "../../utils/faviconResolver";
import { checkImageURL } from "../../utils/imageValidation";
import { blobToBase64, urlToBase64 } from "../../utils/imageConversion";
import { formatDestinationUrl } from "../../utils/url";

export interface IconFormData {
  name: string;
  destination: string;
  /** Final resolved src — already base64 or a plain https URL as fallback */
  src: string;
}

interface IconFormProps {
  /** "add" starts with empty fields; "edit" pre-populates from initialData */
  mode: "add" | "edit";
  initialData?: {
    name: string;
    destination: string;
    src: string;
  };
  /** Called with resolved form data when the user submits successfully */
  onSubmit: (data: IconFormData) => Promise<void>;
  /** Called when submit/save is in progress (lets parent disable its own buttons) */
  onPendingChange?: (pending: boolean) => void;
  /** Extra className for the wrapping <form> element */
  className?: string;
  /** id forwarded to the <form> so an external button can submit it */
  formId?: string;
}

export default function IconForm({
  mode,
  initialData,
  onSubmit,
  onPendingChange,
  className = "",
  formId,
}: IconFormProps) {
  const isEdit = mode === "edit";

  // ── Controlled inputs ──────────────────────────────────────────────────────
  const [nameInput, setNameInput] = useState(initialData?.name ?? "");
  const [destInput, setDestInput] = useState(initialData?.destination ?? "");

  // The "live preview" src shown in the avatar area
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    initialData?.src ?? null,
  );
  // The src we'll save (may differ from previewSrc while blob URL is live)
  const savedSrcRef = useRef<string | null>(initialData?.src ?? null);

  // URL input field
  const [iconUrl, setIconUrl] = useState("");
  const [iconUrlError, setIconUrlError] = useState(false);

  // Ant Upload file list
  const [fileList, setFileList] = useState<RcFile[]>([]);

  // Submission state
  const [pending, setPending] = useState(false);
  const setPendingAndNotify = (v: boolean) => {
    setPending(v);
    onPendingChange?.(v);
  };

  // ── Sync initialData when it changes (e.g. user opens a different icon) ───
  useEffect(() => {
    setNameInput(initialData?.name ?? "");
    setDestInput(initialData?.destination ?? "");
    setPreviewSrc(initialData?.src ?? null);
    savedSrcRef.current = initialData?.src ?? null;
    setIconUrl("");
    setIconUrlError(false);
    setFileList([]);
  }, [initialData?.name, initialData?.destination, initialData?.src]);

  // ── Revoke blob URLs on unmount / preview change ───────────────────────────
  useEffect(() => {
    return () => {
      if (previewSrc?.startsWith("blob:")) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  // ── Icon URL debounced validation ─────────────────────────────────────────
  useEffect(() => {
    if (!iconUrl) {
      setIconUrlError(false);
      return;
    }

    setPendingAndNotify(true);

    const timer = setTimeout(async () => {
      const isValid = await checkImageURL(iconUrl);
      if (!isValid) {
        setPreviewSrc(initialData?.src ?? null);
        savedSrcRef.current = initialData?.src ?? null;
        setIconUrlError(true);
      } else {
        setPreviewSrc(iconUrl);
        savedSrcRef.current = iconUrl;
        setIconUrlError(false);
        // Clear any uploaded file since URL takes precedence
        setFileList([]);
      }
      setPendingAndNotify(false);
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconUrl]);

  // ── Ant Upload config ──────────────────────────────────────────────────────
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

  const uploadProps: UploadProps = {
    name: "image",
    multiple: false,
    showUploadList: true,
    fileList,
    beforeUpload,
    onRemove: () => {
      if (previewSrc?.startsWith("blob:")) URL.revokeObjectURL(previewSrc);
      setPreviewSrc(initialData?.src ?? null);
      savedSrcRef.current = initialData?.src ?? null;
      setFileList([]);
    },
    customRequest: ({ file }) => {
      const f = file as File;
      if (previewSrc?.startsWith("blob:")) URL.revokeObjectURL(previewSrc);
      const blobUrl = URL.createObjectURL(f);
      // Clear the URL field — file takes precedence
      setIconUrl("");
      setIconUrlError(false);
      setPreviewSrc(blobUrl);
      savedSrcRef.current = blobUrl; // will be converted to base64 on submit
      setFileList([f as RcFile]);
    },
    onChange(info) {
      console.log(info.file, info.fileList);
    },
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string).trim();
    const rawDest = (formData.get("destination") as string) || "";
    const destination = formatDestinationUrl(rawDest);

    if (!destination) {
      message.error("Please provide a destination URL.");
      return;
    }

    let src = savedSrcRef.current ?? "";

    if (!src) {
      message.error("You must upload an image or provide an image URL.");
      return;
    }

    setPendingAndNotify(true);

    try {
      // Convert blob → base64
      if (src.startsWith("blob:")) {
        const response = await fetch(src);
        const blob = await response.blob();
        src = await blobToBase64(blob);
      }
      // Convert http(s) URL → base64 (with silent fallback to original URL)
      else if (src.startsWith("http://") || src.startsWith("https://")) {
        src = await urlToBase64(src);
      }

      await onSubmit({ name, destination, src });
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Error saving icon");
    } finally {
      setPendingAndNotify(false);
    }
  };

  // ── Preview avatar ─────────────────────────────────────────────────────────
  const avatarSrc = previewSrc || (nameInput.trim() ? generateLetterAvatar(nameInput.trim()) : null);

  return (
    <form
      id={formId}
      className={`w-full max-w-md ${className}`}
      onSubmit={handleSubmit}
      name={isEdit ? "editIconForm" : "addIconForm"}
    >
      {/* ── Icon preview ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-xl mb-4 border border-gray-700/50">
        <div className="w-14 h-14 rounded-2xl bg-gray-700/60 flex items-center justify-center p-2 shadow-inner">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={nameInput || "Icon preview"}
              className="w-10 h-10 object-contain rounded-md"
            />
          ) : (
            <InboxOutlined className="text-2xl text-gray-400" />
          )}
        </div>
        <span className="mt-2 text-sm font-medium text-gray-200 truncate max-w-[220px]">
          {nameInput.trim() || "Shortcut Preview"}
        </span>
      </div>

      {/* ── Name ──────────────────────────────────────────────────────────── */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Icon label"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* ── Destination ───────────────────────────────────────────────────── */}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Destination</span>
        </label>
        <input
          type="text"
          name="destination"
          placeholder="Destination URL (e.g. www.google.com)"
          value={destInput}
          onChange={(e) => setDestInput(e.target.value)}
          onBlur={() => {
            if (destInput.trim())
              setDestInput(formatDestinationUrl(destInput));
          }}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* ── File upload (Dragger) ──────────────────────────────────────────── */}
      <div className="mt-5">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag an image here to upload your icon
          </p>
          <p className="ant-upload-hint">Maximum file size: 2MB</p>
        </Dragger>
      </div>

      {/* ── Icon URL ──────────────────────────────────────────────────────── */}
      <div className="divider text-xs text-gray-400">or use an image URL</div>
      <div className="form-control w-full">
        <input
          type="text"
          name="iconURL"
          placeholder="Image URL here"
          value={iconUrl}
          onChange={(e) => {
            setIconUrlError(false);
            setIconUrl(e.target.value);
          }}
          className={`input w-full ${
            iconUrlError
              ? "border-red-500 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
              : ""
          }`}
        />
        {iconUrlError && (
          <span className="text-xs text-red-500 mt-2">
            That link doesn't look like an image.{" "}
            {isEdit ? "We'll stick with your original icon for now." : ""}
          </span>
        )}
      </div>

      {/* ── Submit button (only shown in add mode; edit uses an external button) ── */}
      {!isEdit && (
        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={pending}
        >
          {pending ? "Saving Icon..." : "Save Icon"}
        </button>
      )}
    </form>
  );
}
