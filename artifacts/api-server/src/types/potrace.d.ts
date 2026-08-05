declare module "potrace" {
  const potrace: {
    trace(
      buffer: Buffer,
      options: { threshold: number },
      callback: (err: Error | null, svg?: string) => void,
    ): void;
  };

  export default potrace;
}
