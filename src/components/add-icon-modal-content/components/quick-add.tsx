import { useState, useEffect, useRef } from "react";
import db from "../../../database/indexDb";
import { resolveFavicon, ResolvedFavicon } from "../../../utils/faviconResolver";
import { urlToBase64, blobToBase64 } from "../../../utils/imageConversion";
import { formatDestinationUrl } from "../../../utils/url";
import { generateLetterAvatar } from "../../../utils/faviconResolver";
import { Upload, UploadProps, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { checkImageURL } from "../../../utils/imageValidation";

interface QuickAddProps {
  closeDrawer: () => void;
}

export default function QuickAdd({ closeDrawer }: QuickAddProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolvedData, setResolvedData] = useState<ResolvedFavicon | null>(null);
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [previewFavicon, setPreviewFavicon] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ── Debounced auto-resolution ──────────────────────────────────────────────
  useEffect(() => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setResolvedData(null);
      setError("");
      setResolving(false);
      return;
    }

    if (!trimmed.includes(".") && !trimmed.startsWith("http://localhost")) {
      setResolvedData(null);
      return;
    }

    setResolving(true);
    setError("");

    const timer = setTimeout(async () => {
      try {
        const result = await resolveFavicon(trimmed);
        setResolvedData(result);
        setName(result.name);
        setDestination(result.siteUrl);
        setPreviewFavicon(result.faviconUrl);
        setError("");
      } catch (err: unknown) {
        setResolvedData(null);
        setError(err instanceof Error ? err.message : "Could not resolve website URL");
      } finally {
        setResolving(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [inputUrl]);

  // ── Custom icon override state ─────────────────────────────────────────────
  // blobSrc: set when user uploads a file (blob URL, converted to base64 on submit)
  const [blobSrc, setBlobSrc] = useState<string | null>(null);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  // iconUrlInput: the raw text in the URL override field
  const [iconUrlInput, setIconUrlInput] = useState("");
  const [iconUrlError, setIconUrlError] = useState(false);
  // validatedIconUrl: set after debounced validation passes
  const [validatedIconUrl, setValidatedIconUrl] = useState("");

  // Revoke blob on unmount / change
  useEffect(() => {
    return () => {
      if (blobSrc) URL.revokeObjectURL(blobSrc);
    };
  }, [blobSrc]);

  // ── Debounced URL override validation ─────────────────────────────────────
  useEffect(() => {
    if (!iconUrlInput) {
      setIconUrlError(false);
      setValidatedIconUrl("");
      return;
    }

    const timer = setTimeout(async () => {
      const isValid = await checkImageURL(iconUrlInput);
      if (!isValid) {
        setIconUrlError(true);
        setValidatedIconUrl("");
      } else {
        setIconUrlError(false);
        setValidatedIconUrl(iconUrlInput);
        // Clear uploaded file — URL takes precedence
        if (blobSrc) URL.revokeObjectURL(blobSrc);
        setBlobSrc(null);
        setFileList([]);
      }
    }, 600);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconUrlInput]);

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
      if (blobSrc) URL.revokeObjectURL(blobSrc);
      setBlobSrc(null);
      setFileList([]);
    },
    customRequest: ({ file }) => {
      const f = file as File;
      if (blobSrc) URL.revokeObjectURL(blobSrc);
      const objectUrl = URL.createObjectURL(f);
      // Clear URL override — file takes precedence
      setIconUrlInput("");
      setIconUrlError(false);
      setValidatedIconUrl("");
      setBlobSrc(objectUrl);
      setFileList([f as RcFile]);
    },
    onChange(info) {
      console.log(info.file, info.fileList);
    },
  };

  // ── Effective preview: file > URL override > auto-resolved favicon ─────────
  const effectivePreviewSrc = blobSrc || validatedIconUrl || previewFavicon;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please provide an icon name");
      return;
    }

    const formattedDestination = formatDestinationUrl(destination);
    if (!formattedDestination) {
      setError("Please provide a destination URL");
      return;
    }

    if (!effectivePreviewSrc) {
      setError("No icon image available to save");
      return;
    }

    try {
      setPending(true);
      setError("");

      const highestPositionIcon = await db.icons.orderBy("position").last();
      const newPosition = highestPositionIcon ? highestPositionIcon.position + 1 : 0;

      let finalSrc = effectivePreviewSrc;

      if (finalSrc.startsWith("blob:")) {
        const response = await fetch(finalSrc);
        const blob = await response.blob();
        finalSrc = await blobToBase64(blob);
      } else {
        finalSrc = await urlToBase64(finalSrc);
      }

      await db.icons.add({
        id: crypto.randomUUID(),
        name: name.trim(),
        src: finalSrc,
        url: formattedDestination,
        position: newPosition,
      });

      closeDrawer();
    } catch (err) {
      console.error("Error adding favicon icon:", err);
      setError("Failed to save icon to favorites");
    } finally {
      setPending(false);
    }
  };

  const handleReset = () => {
    setName("");
    setDestination("");
    setInputUrl("");
    setResolvedData(null);
    setPreviewFavicon("");
    setIconUrlInput("");
    setIconUrlError(false);
    setValidatedIconUrl("");
    if (blobSrc) URL.revokeObjectURL(blobSrc);
    setBlobSrc(null);
    setFileList([]);
  };

  return (
    <div className="max-w-md w-full">
      {/* ── Resolver input ─────────────────────────────────────────────────── */}
      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text">Website URL</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. github.com, reddit.com"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="input input-bordered add-icon-form-input w-full pr-10"
          />
          {resolving && (
            <span className="loading loading-spinner loading-sm absolute right-3 top-3 text-primary" />
          )}
        </div>
        <label className="label">
          <span className="label-text-alt text-gray-400">
            Paste any URL to automatically fetch its icon and title
          </span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {resolvedData && (
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="mt-4 border-t border-gray-700/60 pt-4"
        >
          {/* ── Icon preview ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-center p-3 bg-gray-800/40 rounded-xl mb-4 border border-gray-700/50">
            <div className="w-14 h-14 rounded-2xl bg-gray-700/60 flex items-center justify-center p-2 shadow-inner">
              {effectivePreviewSrc ? (
                <img
                  src={effectivePreviewSrc}
                  alt={name || "Icon preview"}
                  className="w-10 h-10 object-contain rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      generateLetterAvatar(name.trim() || "?");
                  }}
                />
              ) : name.trim() ? (
                <img
                  src={generateLetterAvatar(name.trim())}
                  alt={name}
                  className="w-10 h-10 object-contain rounded-md"
                />
              ) : (
                <InboxOutlined className="text-2xl text-gray-400" />
              )}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-200 truncate max-w-[220px]">
              {name.trim() || "Shortcut Preview"}
            </span>
          </div>

          {/* ── Name ─────────────────────────────────────────────────────── */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Icon label"
              className="input input-bordered add-icon-form-input w-full"
              required
            />
          </div>

          {/* ── Destination ──────────────────────────────────────────────── */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onBlur={() => {
                if (destination.trim())
                  setDestination(formatDestinationUrl(destination));
              }}
              placeholder="Destination URL (e.g. www.google.com)"
              className="input input-bordered add-icon-form-input w-full"
              required
            />
          </div>

          {/* ── File upload (Dragger) ─────────────────────────────────────── */}
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

          {/* ── Icon URL override ─────────────────────────────────────────── */}
          <div className="divider text-xs text-gray-400">or use an image URL</div>
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Image URL here"
              value={iconUrlInput}
              onChange={(e) => {
                setIconUrlError(false);
                setIconUrlInput(e.target.value);
              }}
              className={`input w-full ${
                iconUrlError
                  ? "border-red-500 focus:border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]"
                  : ""
              }`}
            />
            {iconUrlError && (
              <span className="text-xs text-red-500 mt-2">
                That link doesn't look like an image.
              </span>
            )}
          </div>

          {/* ── Submit ───────────────────────────────────────────────────── */}
          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            disabled={pending || !name.trim() || !destination.trim()}
          >
            {pending ? "Saving Icon..." : "Save Icon"}
          </button>
        </form>
      )}
    </div>
  );
}
