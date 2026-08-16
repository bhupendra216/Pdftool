import React from 'react';
import { Helmet } from 'react-helmet-async';

type Props = {
  title: string;
  description: string;
  path: string;
};

const Seo: React.FC<Props> = ({ title, description, path }) => {
  const canonical = `https://pdfkira.vercel.app${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default Seo;
