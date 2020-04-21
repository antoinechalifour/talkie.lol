const isImage = (item: DataTransferItem) => item.kind === "file";

const readImage = (item: DataTransferItem): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);

    reader.readAsDataURL(item.getAsFile()!);
  });

export const getImageFromClipboard = async (
  items: DataTransferItemList
): Promise<string | null> => {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    if (isImage(item)) {
      return readImage(item);
    }
  }

  return null;
};
