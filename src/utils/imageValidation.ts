/**
 * Checks if a URL points to a valid image.
 * Returns a Promise that resolves to true if the image loads successfully.
 */
export const checkImageURL = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
