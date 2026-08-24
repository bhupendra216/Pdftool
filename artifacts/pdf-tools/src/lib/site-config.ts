// Central site URL used for generating canonical links, sitemaps and JSON-LD.
// Set VITE_SITE_URL in your environment to switch domains without code changes.
const rawSiteUrl = import.meta.env.VITE_SITE_URL || "https://pdfkira.com";
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
export const SITE_NAME = "PDFKira";
export const SITE_IMAGE = `${SITE_URL}/logo.png`;
