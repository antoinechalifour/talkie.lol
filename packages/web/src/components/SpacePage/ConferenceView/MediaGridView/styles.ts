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
    width: 30%;
    top: 0px;
    right: 0px;
    border: 1px solid black;

    p {
      display: none;
    }
  }
`;

export const MediaGridLayout = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 50%;
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
  border: 2px solid var(--color-black);
  animation: ${mediaEnterAnimation} 0.25s ease;
`;
