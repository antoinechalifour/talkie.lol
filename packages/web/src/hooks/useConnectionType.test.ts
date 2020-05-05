import { act, renderHook } from "@testing-library/react-hooks";

import { useConnectionType } from "./useConnectionType";

const setInitialEffectiveType = (effectiveType: string) =>
  // @ts-ignore
  (navigator.connection.effectiveType = effectiveType);

const updateEffectiveType = (effectiveType: string) => {
  setInitialEffectiveType(effectiveType);

  // @ts-ignore
  navigator.connection.dispatchEvent(new Event("change"));
};

const goOffline = () => window.dispatchEvent(new Event("offline"));

const goOnline = (effectiveType: string) => {
  setInitialEffectiveType(effectiveType);
  return window.dispatchEvent(new Event("online"));
};

describe("useConnectionType", () => {
  it('should return "slow" when the initial connection type is "slow-2g"', () => {
    // Given
    setInitialEffectiveType("slow-2g");

    // When
    const { result } = renderHook(() => useConnectionType());

    // Then
    expect(result.current.connectionType).toEqual("slow");
  });

  it('should return "slow" when the initial connection type is "2g"', () => {
    // Given
    setInitialEffectiveType("2g");

    // When
    const { result } = renderHook(() => useConnectionType());

    // Then
    expect(result.current.connectionType).toEqual("slow");
  });

  it('should return "medium" when the initial connection type is "3g"', () => {
    // Given
    setInitialEffectiveType("3g");

    // When
    const { result } = renderHook(() => useConnectionType());

    // Then
    expect(result.current.connectionType).toEqual("medium");
  });

  it('should return "fast" when the initial connection type is "4g"', () => {
    // Given
    setInitialEffectiveType("4g");

    // When
    const { result } = renderHook(() => useConnectionType());

    // Then
    expect(result.current.connectionType).toEqual("fast");
  });

  it('should return "unknown" when the initial connection type is unknown', () => {
    // Given
    setInitialEffectiveType("5g");

    // When
    const { result } = renderHook(() => useConnectionType());

    // Then
    expect(result.current.connectionType).toEqual("unknown");
  });

  describe("when the connection changes", () => {
    it("should update the connection type", () => {
      // Given
      setInitialEffectiveType("2g");
      const { result } = renderHook(() => useConnectionType());

      // When
      act(() => {
        updateEffectiveType("4g");
      });

      // Then
      expect(result.current.connectionType).toEqual("fast");
    });
  });

  describe("when the connection is set to offline", () => {
    it('should update the connection type of "offline"', () => {
      // Given
      setInitialEffectiveType("2g");
      const { result } = renderHook(() => useConnectionType());

      // When
      act(() => {
        goOffline();
      });

      // Then
      expect(result.current.connectionType).toEqual("offline");
    });
  });

  describe("when the connection is back online", () => {
    it("should update the connection type", () => {
      // Given
      setInitialEffectiveType("2g");
      const { result } = renderHook(() => useConnectionType());

      // When
      act(() => {
        goOffline();
        goOnline("4g");
      });

      // Then
      expect(result.current.connectionType).toEqual("fast");
    });
  });
});
