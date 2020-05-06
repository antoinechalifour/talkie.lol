import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Video } from "./Video";

describe("<Video />", () => {
  it("should render a video with an object-fit set to cover by default", () => {
    // Given
    render(<Video ref={null} title="my-video" />);

    // When
    const video = screen.getByTitle("my-video");

    // Then
    expect(video).toHaveStyle("object-fit: cover;");
  });

  describe("when the user double clicks", () => {
    it("should set the object-fit to contain", () => {
      // Given
      render(<Video ref={null} title="my-video" />);

      const video = screen.getByTitle("my-video");

      // When
      fireEvent.doubleClick(video);

      // Then
      expect(video).toHaveStyle("object-fit: contain;");

      // When
      fireEvent.doubleClick(video);

      // Then
      expect(video).toHaveStyle("object-fit: cover;");
    });
  });
});
