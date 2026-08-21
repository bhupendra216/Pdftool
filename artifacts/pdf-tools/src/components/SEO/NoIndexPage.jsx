import { Helmet } from 'react-helmet-async';

/**
 * Use this on pages that must not be indexed, such as admin or staging routes.
 */
export default function NoIndexPage() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
