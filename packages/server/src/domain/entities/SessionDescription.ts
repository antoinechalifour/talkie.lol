export class SessionDescription {
  private constructor(
    public readonly type: "offer" | "answer",
    public readonly sdp: string
  ) {}

  static offer(sdp: string): SessionDescription {
    return new SessionDescription("offer", sdp);
  }

  static answer(sdp: string): SessionDescription {
    return new SessionDescription("answer", sdp);
  }
}
