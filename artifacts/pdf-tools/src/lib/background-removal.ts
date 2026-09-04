let backgroundRemovalModulePromise: Promise<typeof import("@imgly/background-removal")> | null = null;

type BackgroundRemovalProgressHandler = (stepKey: string, current: number, total: number) => void;

async function loadBackgroundRemovalModule() {
  if (!backgroundRemovalModulePromise) {
    backgroundRemovalModulePromise = import("@imgly/background-removal");
  }

  return backgroundRemovalModulePromise;
}

async function loadImageDimensions(blob: Blob) {
  const bitmap = await createImageBitmap(blob);
  try {
    return { width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close?.();
  }
}

async function normalizeToPng(blob: Blob, targetSize?: { width: number; height: number }): Promise<Blob> {
  if (blob.type === "image/png" && (!targetSize || (blob.type === "image/png" && targetSize.width <= 0))) {
    return blob;
  }

  const bitmap = await createImageBitmap(blob);
  try {
    const sourceWidth = bitmap.width;
    const sourceHeight = bitmap.height;
    const width = Math.max(1, targetSize?.width ?? sourceWidth);
    const height = Math.max(1, targetSize?.height ?? sourceHeight);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas unavailable.");
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
    });

    canvas.width = 0;
    canvas.height = 0;

    if (!pngBlob) {
      throw new Error("PNG conversion failed.");
    }

    return pngBlob;
  } finally {
    bitmap.close?.();
  }
}

export async function removeBackgroundToPng(
  input: Blob,
  onProgress?: BackgroundRemovalProgressHandler,
  targetSize?: { width: number; height: number },
): Promise<Blob> {
  const { removeBackground } = await loadBackgroundRemovalModule();
  const output = await removeBackground(input, {
    output: {
      format: "image/png",
      quality: 1,
    },
    progress: onProgress
      ? (stepKey, current, total) => {
          onProgress(stepKey, current, total);
        }
      : undefined,
  });

  const originalSize = targetSize ?? (await loadImageDimensions(input));
  return normalizeToPng(output, originalSize);
}

export async function preloadBackgroundRemoval() {
  const { preload } = await loadBackgroundRemovalModule();
  return preload;
}

export type { BackgroundRemovalProgressHandler };
