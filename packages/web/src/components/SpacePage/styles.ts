import styled from "styled-components";

export const SpaceLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const HeaderLayout = styled.header`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: 1fr auto;
  padding: 2rem;

  background: var(--color-background-darker);
  color: var(--color-text);
  border-bottom: 2px solid var(--color-background-lighter);

  h1 {
    color: var(--color-text-darker);

    span {
      display: none;
    }

    @media (min-width: 860px) {
      span {
        display: inline;
        font-weight: normal;
        color: var(--color-text);
      }
    }
  }

  svg {
    margin-right: 1rem;
  }
`;

export const MainContent = styled.main`
  position: relative;
  flex: 1;
  display: flex;
  place-items: center;
  padding: 1rem;
  overflow-y: scroll;
  background: var(--color-background);

  > :first-child {
    width: 100%;
  }
`;

export const ControlsLayout = styled.footer`
  padding: 1rem 1.5rem;

  background: var(--color-background-darker);
  color: var(--color-text);
  text-align: center;

  border-top: 1px solid var(--color-background-lighter);
`;

export const QrCodeWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  canvas {
    border-radius: 5px;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2);
  }
`;
