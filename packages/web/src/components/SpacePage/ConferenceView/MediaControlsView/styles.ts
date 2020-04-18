import styled from "styled-components";

export const MediaControlsLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  grid-gap: 2rem;
`;

export const ShareScreenButton = styled.button`
  all: unset;

  display: flex;
  place-content: center;
  height: 50px;
  width: 50px;
  border-radius: 1rem;

  background: var(--button-background);
  color: var(--button-text);

  cursor: pointer;
`;

export const CancelButton = styled(ShareScreenButton)`
  background: var(--button-danger-background);
`;
