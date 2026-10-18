/**
 * Converts a Blob or File to a Base64 data URL string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert image to base64"));
    reader.readAsDataURL(blob);
  });
};

/**
 * Fetches an image from an external URL and converts it into a Base64 data URL.
 * Falls back to HTMLImageElement + Canvas rendering if direct fetch fails (e.g. CORS).
 * If all conversions fail, it returns the original URL so the icon remains functional.
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  if (!url) return url;
  if (url.startsWith("data:")) return url;

  // Attempt 1: direct fetch -> blob -> base64 (fastest, preserves SVG/PNG exact bytes)
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch {
    // Attempt 2: fallback using Image + Canvas
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 48;
          canvas.height = img.naturalHeight || 48;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(url);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        } catch {
          resolve(url);
        }
      };
      img.onerror = () => {
        // Fallback to original URL
        resolve(url);
      };
      img.src = url;
    });
  }
};
