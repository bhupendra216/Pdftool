export type PdfiumEditSessionStatus = 'ready' | 'loading' | 'error';

export type PdfiumSupportInfo = {
  hasPdfiumRuntime: boolean;
  supportsObjectRemoval: boolean;
  mode: 'client-side';
};

export type PdfiumEditSession = {
  name: string;
  status: PdfiumEditSessionStatus;
  createdAt: number;
};

export function getPdfiumSupportInfo(): PdfiumSupportInfo {
  return {
    hasPdfiumRuntime: true,
    supportsObjectRemoval: true,
    mode: 'client-side',
  };
}

export function createPdfEditSession(options: { name: string }): PdfiumEditSession {
  return {
    name: options.name,
    status: 'ready',
    createdAt: Date.now(),
  };
}
