import { Author, Message } from "./Message";
import { v4 as uuid } from "uuid";

export interface Preview {
  fileId: string;
  fileName: string;
  mimeType: string;
}

export class FilePreviewMessage extends Message {
  private constructor(
    id: string,
    author: Author,
    receivedAt: Date,
    private _preview: Preview
  ) {
    super(id, author, receivedAt);
  }

  preview() {
    return this._preview;
  }

  static createFilePreviewMessage(
    author: Author,
    fileId: string,
    fileName: string,
    mimeType: string
  ) {
    return new FilePreviewMessage(uuid(), author, new Date(), {
      fileId,
      fileName,
      mimeType,
    });
  }
}
