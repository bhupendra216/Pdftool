declare module "qrcode" {
  const QRCode: {
    toCanvas(canvas: HTMLCanvasElement, text: string, options?: any): Promise<void>;
    toDataURL(text: string, options?: any): Promise<string>;
  };

  export default QRCode;
}
