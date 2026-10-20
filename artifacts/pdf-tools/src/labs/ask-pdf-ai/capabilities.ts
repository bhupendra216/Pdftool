export type LabCapabilities = {
  webGpuAvailable: boolean;
  adapterAvailable: boolean;
  adapterInfo: string;
  deviceMemory: number | null;
  cacheStorageAvailable: boolean;
  indexedDbAvailable: boolean;
  reason: string;
};

export type LabMode = "AI answers" | "Smart search" | "Keyword search";

type GpuAdapterLike = {
  info?: { vendor?: string; architecture?: string; device?: string; description?: string };
  requestAdapterInfo?: () => Promise<{
    vendor?: string;
    architecture?: string;
    device?: string;
    description?: string;
  }>;
};

type GpuLike = {
  requestAdapter: () => Promise<GpuAdapterLike | null>;
};

function describeAdapterInfo(info: GpuAdapterLike["info"]): string {
  if (!info) return "Adapter details are not exposed by this browser.";
  return [info.vendor, info.architecture, info.device, info.description]
    .filter((value): value is string => Boolean(value))
    .join(" / ") || "Adapter details are not exposed by this browser.";
}

export async function detectLabCapabilities(): Promise<LabCapabilities> {
  let gpu: GpuLike | undefined;
  try {
    gpu = "gpu" in navigator ? (navigator as Navigator & { gpu?: GpuLike }).gpu : undefined;
  } catch {
    gpu = undefined;
  }
  let adapterAvailable = false;
  let adapterInfo = "WebGPU is unavailable in this browser.";
  let reason = "WebGPU is unavailable; smart search can still run with WebAssembly.";

  if (gpu) {
    try {
      const adapter = await gpu.requestAdapter();
      adapterAvailable = Boolean(adapter);
      if (adapter) {
        adapterInfo = describeAdapterInfo(adapter.info);
        if (adapter.requestAdapterInfo) {
          try {
            adapterInfo = describeAdapterInfo(await adapter.requestAdapterInfo());
          } catch {
            adapterInfo = describeAdapterInfo(adapter.info);
          }
        }
        reason = "WebGPU adapter found. A model may still fail to load because of device or browser limits.";
      } else {
        adapterInfo = "The browser exposes WebGPU but returned no compatible adapter.";
        reason = "No compatible WebGPU adapter was available; use smart or keyword search.";
      }
    } catch {
      adapterInfo = "The browser's WebGPU adapter check failed.";
      reason = "WebGPU initialization failed; use smart or keyword search.";
    }
  }

  let indexedDbAvailable = false;
  try {
    if ("indexedDB" in globalThis && indexedDB) {
    indexedDbAvailable = await new Promise<boolean>((resolve) => {
      try {
        const request = indexedDB.open("ask-pdf-ai-capability-check");
        request.onsuccess = () => {
          request.result.close();
          indexedDB.deleteDatabase("ask-pdf-ai-capability-check");
          resolve(true);
        };
        request.onerror = () => resolve(false);
        request.onblocked = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
    }
  } catch {
    indexedDbAvailable = false;
  }

  let cacheStorageAvailable = false;
  try {
    cacheStorageAvailable = "caches" in globalThis && Boolean(globalThis.caches);
  } catch {
    cacheStorageAvailable = false;
  }

  let deviceMemory: number | null = null;
  try {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof memory === "number" && Number.isFinite(memory)) deviceMemory = memory;
  } catch {
    deviceMemory = null;
  }

  return {
    webGpuAvailable: Boolean(gpu),
    adapterAvailable,
    adapterInfo,
    deviceMemory,
    cacheStorageAvailable,
    indexedDbAvailable,
    reason,
  };
}

export function modeForCapabilities(capabilities: LabCapabilities, smartSearchLoaded: boolean): LabMode {
  if (capabilities.adapterAvailable) return "AI answers";
  return smartSearchLoaded ? "Smart search" : "Keyword search";
}
