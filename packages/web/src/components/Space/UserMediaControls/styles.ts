import styled from "styled-components";

export const UserMediaControlsWrapper = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr minmax(auto, 25%) 1fr minmax(auto, 25%);
  max-width: 860px;
  margin: auto;

  > * {
    align-self: center;
    display: block;
  }
`;

export const MediaSourceLabel = styled.label``;

export const MediaSourceSelect = styled.select`
  appearance: none;
  background: var(--color-background-lighter);
  padding: 0.5rem 1rem;
  color: var(--color-text);
  font-weight: bold;
  border-color: black;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: inherit;
`;
