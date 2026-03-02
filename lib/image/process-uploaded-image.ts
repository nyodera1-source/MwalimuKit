/**
 * Client-side image processing: sharpen and enhance uploaded diagram images.
 * Uses Canvas API for contrast/brightness boost.
 * Returns base64 data URI.
 */
export function processUploadedImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback: return raw base64
          resolve(e.target?.result as string);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Enhance: boost contrast and brightness for clearer diagrams
        ctx.filter = "contrast(1.3) brightness(1.1) saturate(0.1)";
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
