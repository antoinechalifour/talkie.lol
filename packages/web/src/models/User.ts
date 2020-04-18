export interface User {
  id(): string;
  name(): string;
  mediaStream(): MediaStream;
}
