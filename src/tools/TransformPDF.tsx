import React from 'react';
import DirtyPDF from './DirtyPDF';

export default function TransformPDF(): JSX.Element {
  // Thin wrapper so imports can reference TransformPDF while reusing the
  // existing implementation in `DirtyPDF`. The UI inside `DirtyPDF` was
  // previously updated to show Transform wording.
  return <DirtyPDF />;
}
