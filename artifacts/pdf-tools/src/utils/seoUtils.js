import { siteUrl } from '@/data/seoConfig';

export function truncateString(str = '', maxLength = 60) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1).trimEnd()}…`;
}

export function generateCanonicalSlug(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function validateTitle(title, maxLength = 60) {
  if (!title) return 'PDFKira';
  return truncateString(title, maxLength);
}

export function validateDescription(desc, maxLength = 160) {
  if (!desc) return 'PDFKira free online PDF tools for everyday document work.';
  return truncateString(desc, maxLength);
}

export function generateKeywords(toolName) {
  const base = (toolName || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  return base.split(/\s+/).filter(Boolean).slice(0, 5);
}

export function formatDateForSchema(dateValue) {
  if (!dateValue) return new Date().toISOString();
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}
