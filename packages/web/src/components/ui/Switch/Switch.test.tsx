import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Switch } from "./Switch";

describe("<Switch />", () => {
  let onChange: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
  });

  it("should render an input with a label", () => {
    // Given
    const id = "switch-id";
    const label = "Enable video";

    render(<Switch id={id} label={label} isOn={true} onChange={onChange} />);

    // When
    const input = screen.getByLabelText(label) as HTMLInputElement;

    // Then
    expect(input.id).toEqual(id);
    expect(input.checked).toBe(true);
  });

  it("should render an unchecked input", () => {
    // Given
    const label = "Enable video";

    render(
      <Switch id={"switch-id"} label={label} isOn={false} onChange={onChange} />
    );

    // When
    const input = screen.getByLabelText(label) as HTMLInputElement;

    // Then
    expect(input.checked).toBe(false);
  });

  describe("when clicking the input", () => {
    it("should call the onChange prop", () => {
      // Given
      const label = "Enable video";

      render(
        <Switch
          id={"switch-id"}
          label={label}
          isOn={false}
          onChange={onChange}
        />
      );

      const input = screen.getByLabelText(label) as HTMLInputElement;

      // When
      fireEvent.click(input);

      // Then
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});
