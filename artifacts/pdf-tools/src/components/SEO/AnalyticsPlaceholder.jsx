/**
 * Placeholder analytics integration for future free analytics providers like Plausible or Fathom.
 */
export default function AnalyticsPlaceholder({ eventName, eventData = {} }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[AnalyticsPlaceholder]', eventName, eventData);
  }
  return null;
}
