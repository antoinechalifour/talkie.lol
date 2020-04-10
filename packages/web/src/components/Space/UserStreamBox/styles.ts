import styled from "styled-components";

export const Video = styled.video`
  width: 100%;
  display: block;
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

  > div {
    position: absolute;
    right: -1px;
    bottom: -1px;
    padding: 1rem 3rem 0.5rem 5rem;
    clip-path: polygon(3rem 0%, 100% 0, 100% 100%, 0% 100%);
    font-weight: bold;
    background: var(--color-background-lighter);
  }
`;

export const LocalVideoBoxLayout = styled(VideoBoxLayout)`
  border-color: var(--color-accent);

  > div {
    background: var(--color-accent);
    color: var(--color-accent-darker);
  }
`;

export const AllMute = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: var(--color-text);
`;

export const SoundIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: var(--color-accent);
`;

export const RemotePeerInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1rem;
  align-items: center;
  color: var(--color-text);
`;

export const DebugButton = styled.button`
  all: unset;
  cursor: pointer;
  color: var(--color-text-darker);
  transform: scale(1);
  transition: transform 0.3s ease;

  &:hover {
    color: var(--color-accent);
    transform: scale(1.2);
  }
`;