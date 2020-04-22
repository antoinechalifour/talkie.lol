import styled from "styled-components";

export const MediaControlsLayout = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto auto auto 1fr auto auto;
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

export const QrCodeArea = styled.div`
  padding: 0 1rem;

  p {
    margin-bottom: 2rem;
  }

  canvas {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;
