declare module 'potrace' {
  const potrace: {
    trace: (
      buffer: Buffer,
      options: Record<string, unknown>,
      callback: (err: Error | null, svg?: string) => void,
    ) => void;
  };

  export default potrace;
}
