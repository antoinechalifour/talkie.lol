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
      font-weight: normal;
      color: var(--color-text);
    }
  }

  svg {
    margin-right: 1rem;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  background: var(--color-background);
`;

export const VideoGrid = styled.div`
  display: grid;
  grid-gap: 1.5rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ControlsLayout = styled.footer`
  padding: 2rem;
  background: var(--color-background-darker);
  color: var(--color-text);
  border-top: 2px solid var(--color-background-lighter);
  text-align: center;
`;

export const VideoBoxLayout = styled.div`
  border: 0.5rem solid var(--color-background-lighter);
  border-radius: 0.5rem;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 75%;
  background: var(--color-background-darker);

  > video {
    position: absolute;
    top: 50%;
    left: 50%;
    max-height: 100%;
    transform: translate(-50%, -50%);
  }

  > p {
    position: absolute;
    right: -1px;
    bottom: -1px;
    display: block;
    padding: 1rem 3rem 0.5rem 5rem;
    clip-path: polygon(3rem 0%, 100% 0, 100% 100%, 0% 100%);
    font-weight: bold;
    background: var(--color-background-lighter);
  }
`;

export const LocalVideoBoxLayout = styled(VideoBoxLayout)`
  border-color: var(--color-accent);

  > p {
    background: var(--color-accent);
    color: var(--color-accent-darker);
  }
`;
