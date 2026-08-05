const DEFAULT_SITE_URL = "https://pdfkira.com";

function normalizeSiteUrl(value: string) {
	return value.replace(/\/$/, "");
}

export const SITE_NAME = "PDFKira";
export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL);
