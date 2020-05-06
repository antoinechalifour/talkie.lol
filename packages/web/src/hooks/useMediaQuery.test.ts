import { act, renderHook } from "@testing-library/react-hooks";

import { MockMediaQueryList } from "../test-utils/mediaQueryList";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    window.matchMedia = undefined;
  });

  it("should initially return true when the current media query matches", () => {
    // Given
    (window.matchMedia as jest.Mock).mockReturnValue(
      MockMediaQueryList.create(true)
    );

    // When
    const { result } = renderHook(() => useMediaQuery("min-width: 800px"));

    // Then
    expect(result.current).toEqual(true);
  });

  it("should initially return false when the current media query does not match", () => {
    // Given
    (window.matchMedia as jest.Mock).mockReturnValue(
      MockMediaQueryList.create(false)
    );

    // When
    const { result } = renderHook(() => useMediaQuery("min-width: 800px"));

    // Then
    expect(result.current).toEqual(false);
  });

  describe("when the media query changes", () => {
    it("should return whether the media query matches", () => {
      const mediaQueryList = MockMediaQueryList.create(false);
      // Given
      (window.matchMedia as jest.Mock).mockReturnValue(mediaQueryList);

      // When
      const { result } = renderHook(() => useMediaQuery("min-width: 800px"));

      act(() => {
        mediaQueryList.setMatches(true);
      });

      // Then
      expect(result.current).toEqual(true);
    });
  });
});
