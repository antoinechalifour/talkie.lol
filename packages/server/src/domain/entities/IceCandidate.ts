export class IceCandidate {
  private constructor(
    public candidate: string,
    public sdpMid: string,
    public sdpMLineIndex: number
  ) {}

  static create(candidate: string, sdpMid: string, sdpMLineIndex: number) {
    return new IceCandidate(candidate, sdpMid, sdpMLineIndex);
  }
}
