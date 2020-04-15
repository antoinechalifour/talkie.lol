import styled from "styled-components";

export const MediaControlsWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  color: var(--color-text-darker);

  > button {
    cursor: pointer;
  }

  > button[aria-pressed="true"] {
    color: var(--color-accent);
  }
`;

export const ControlButton = styled.button`
  all: unset;
`;

export const ExpandButton = styled(ControlButton)`
  display: none;

  @media (min-width: 860px) {
    display: block;
  }
`;
