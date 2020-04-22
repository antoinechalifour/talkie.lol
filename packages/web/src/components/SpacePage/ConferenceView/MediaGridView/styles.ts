import styled, { keyframes } from "styled-components";
import { VideoAspectRatioContainer } from "../../../ui/VideoAspectRatioContainer";

export const LocalUserLayout = styled(VideoAspectRatioContainer)`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;

export const DualStreamLayout = styled(VideoAspectRatioContainer)`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;

  > :last-child {
    position: absolute;
    width: 33%;
    top: 2px;
    right: 2px;

    p {
      display: none;
    }
  }
`;

export const MediaGridLayout = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 860px;
  max-height: 100%;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const mediaEnterAnimation = keyframes`
  from {
    transform: perspective(500px) translateZ(50px);
    opacity: 0;
  }
  to {
    transform: perspective(500px) translateZ(0);
    opacity: 1;
  }
`;

export const MediaArea = styled(VideoAspectRatioContainer)`
  position: relative;
  box-shadow: var(--box-shadow);

  animation: ${mediaEnterAnimation} 0.25s ease;
`;
