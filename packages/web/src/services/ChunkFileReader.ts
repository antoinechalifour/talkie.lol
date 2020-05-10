export type OnChunkListener = (chunk: ArrayBuffer) => void;

export class ChunkFileReader {
  private _offset = 0;
  private _fileReader: FileReader = new FileReader();
  private _listeners: Set<OnChunkListener> = new Set();

  constructor(private _file: File, private _chunkSize: number) {
    this._fileReader.onload = () => this._readMore();
  }

  read() {
    this._readCurrentSlice();
  }

  onChunk(listener: OnChunkListener) {
    this._listeners.add(listener);

    return () => this._listeners.delete(listener);
  }

  private _readMore() {
    let chunk = this._fileReader.result as ArrayBuffer;
    this._notifyListener(chunk);
    this._offset += chunk.byteLength;

    if (this._offset < this._file.size) {
      this._readCurrentSlice();
    }
  }

  private _readCurrentSlice() {
    const slice = this._file.slice(
      this._offset,
      this._offset + this._chunkSize
    );

    this._fileReader.readAsArrayBuffer(slice);
  }

  private _notifyListener(chunk: ArrayBuffer) {
    this._listeners.forEach((listener) => listener(chunk));
  }
}
