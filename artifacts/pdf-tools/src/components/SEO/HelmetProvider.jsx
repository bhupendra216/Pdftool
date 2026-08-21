import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

/**
 * Local provider wrapper used by the app to ensure Helmet metadata is scoped correctly.
 * This keeps the SEO system reusable and avoids direct DOM manipulation in components.
 */
export default function HelmetProvider({ children }) {
  return <ReactHelmetProvider>{children}</ReactHelmetProvider>;
}
