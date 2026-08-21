import { useEffect } from 'react';

/**
 * Injects schema into the document head and removes it on unmount. Keeping this separate
 * makes the schema system reusable and avoids duplicate JSON-LD blocks.
 */
export default function useSchema(schemaType, schemaData) {
  useEffect(() => {
    if (!schemaType || !schemaData) return undefined;

    const scriptId = `schema-${schemaType}`;
    let script = document.head.querySelector(`#${scriptId}`);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schemaData);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [schemaType, schemaData]);
}
