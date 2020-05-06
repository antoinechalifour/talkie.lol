export class MockMediaQueryList extends MediaQueryList {
  private constructor(matches: boolean) {
    super();

    Object.assign(this, { matches });
  }

  static create(matches: boolean) {
    return new MockMediaQueryList(matches);
  }

  setMatches(matches: boolean) {
    const event = new MediaQueryListEvent("change", { matches });

    Object.assign(this, { matches });

    this.onchange?.(event);
  }
}
