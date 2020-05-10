export const splitStringToChunks = (message: string, chunkSize: number) => {
  const chunks: string[] = [];
  let chunkIndex = 0;
  let isDone = false;

  do {
    const chunkStart = chunkIndex * chunkSize;
    const chunkMaximumEnd = chunkStart + chunkSize;

    isDone = chunkMaximumEnd >= message.length;

    const chunkEnd = Math.min(chunkMaximumEnd, message.length);
    const chunkContent = message.substring(chunkStart, chunkEnd);

    chunks.push(chunkContent);
    chunkIndex += 1;
  } while (!isDone);

  return chunks;
};
