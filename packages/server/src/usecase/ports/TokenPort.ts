export interface TokenPort<T> {
  sign(payload: T): Promise<string>;

  decode(token: string): Promise<T>;
}
