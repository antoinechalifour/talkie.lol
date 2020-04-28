const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject();
      else resolve(blob);
    });
  });

export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement) => {
  const blob = await canvasToBlob(canvas);

  // @ts-ignore
  const item = new ClipboardItem({ "image/png": blob });
  await navigator.clipboard.write([item]);
};
