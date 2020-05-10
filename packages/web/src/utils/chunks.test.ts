import { splitStringToChunks } from "./chunks";

describe("splitStringToChunks", () => {
  describe("when the message is shorter than the chunk size", () => {
    it("produces 1 chunk", () => {
      // Given
      const message = "message";
      const chunkSize = 100;

      // When
      const chunks = splitStringToChunks(message, chunkSize);

      // Then
      expect(chunks).toEqual(["message"]);
    });
  });

  describe("when the message is the same size as the chunk", () => {
    it("produces 1 chunk", () => {
      // Given
      const message = "message";
      const chunkSize = 7;

      // When
      const chunks = splitStringToChunks(message, chunkSize);

      // Then
      expect(chunks).toEqual(["message"]);
    });
  });

  describe("when the message is longer than the chunk size", () => {
    it("produces 2 chunks", () => {
      // Given
      const message = "message";
      const chunkSize = 4;

      // When
      const chunks = splitStringToChunks(message, chunkSize);

      // Then
      expect(chunks).toEqual(["mess", "age"]);
    });
  });

  describe("when the message is twice as long as the chunk size", () => {
    it("produces 2 chunks", () => {
      // Given
      const message = "messagemessage";
      const chunkSize = 7;

      // When
      const chunks = splitStringToChunks(message, chunkSize);

      // Then
      expect(chunks).toEqual(["message", "message"]);
    });
  });
});
