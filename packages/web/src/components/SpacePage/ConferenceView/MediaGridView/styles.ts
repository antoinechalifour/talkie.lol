import styled, { keyframes } from "styled-components";
import { VideoAspectRatioContainer } from "../../../ui/VideoAspectRatioContainer";

export const LocalUserLayout = styled(VideoAspectRatioContainer)`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
`;

export const DualStreamLayout = styled(VideoAspectRatioContainer)`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  > :last-child {
    position: absolute;
    width: 33%;
    bottom: 2px;
    right: 2px;

    p {
      display: none;
    }
  }
`;

export const MediaGridLayout = styled.div`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-gap: 2rem;

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
