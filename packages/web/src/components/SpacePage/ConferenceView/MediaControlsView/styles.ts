import styled from "styled-components/macro";

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
  color: #fff;

  cursor: pointer;

  &:focus {
    outline: var(--outline-style);
  }
`;

export const CancelButton = styled(ShareScreenButton)`
  background: var(--button-danger-background);
`;

export const QrCodeArea = styled.div`
  display: grid;
  grid-gap: 2rem;
  padding: 0 1rem;

  button {
    all: unset;
    cursor: pointer;
    line-height: 1.6;
  }

  button:focus {
    outline: var(--outline-style);
  }

  button span {
    text-decoration: underline;
  }

  button svg {
    margin-left: 0.5rem;
    font-size: 2rem;
  }

  canvas {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const tooltipStyle = {
  background: "var(--color-black)",
  color: "var(--color-white)",
  padding: "1rem",
  borderRadius: "0.5rem",
};
