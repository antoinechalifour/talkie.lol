import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { DropdownButton } from "./DropdownButton";
import { DropdownToggle } from "./DropdownToggle";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownOptionButton } from "./DropdownOptionButton";

const noop = () => {};

describe("<DropdownButton />", () => {
  it("should render a button with a closed menu", () => {
    // Given
    render(
      <DropdownButton>
        <DropdownToggle>Click me</DropdownToggle>

        <DropdownMenu>
          <ul>
            <li>
              <DropdownOptionButton onClick={noop}>Yes</DropdownOptionButton>
            </li>
            <li>
              <DropdownOptionButton onClick={noop}>No</DropdownOptionButton>
            </li>
          </ul>
        </DropdownMenu>
      </DropdownButton>
    );

    // When
    const yesOption = screen.queryByText("Yes");
    const noOption = screen.queryByText("Yes");

    // Then
    expect(yesOption).toBeNull();
    expect(noOption).toBeNull();
  });

  describe("when clicking the toggle button", () => {
    it("should open the menu", () => {
      // Given
      render(
        <DropdownButton>
          <DropdownToggle>Click me</DropdownToggle>

          <DropdownMenu>
            <ul>
              <li>
                <DropdownOptionButton onClick={noop}>Yes</DropdownOptionButton>
              </li>
              <li>
                <DropdownOptionButton onClick={noop}>No</DropdownOptionButton>
              </li>
            </ul>
          </DropdownMenu>
        </DropdownButton>
      );

      const toggleButton = screen.getByLabelText("Toggle dropdown");

      // When
      fireEvent.click(toggleButton);

      const yesOption = screen.queryByText("Yes");
      const noOption = screen.queryByText("Yes");

      // Then
      // Should show the menu
      expect(yesOption).toBeInTheDocument();
      expect(noOption).toBeInTheDocument();
    });
  });
});
