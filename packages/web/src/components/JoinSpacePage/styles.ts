import styled from "styled-components";

import { Button } from "../ui/Button";
import { VideoAspectRatioContainer } from "../ui/VideoAspectRatioContainer";

export const VideoLayout = styled(VideoAspectRatioContainer)`
  width: 98%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  background: var(--background-video);
  box-shadow: var(--box-shadow);
`;

export const JoinButton = styled(Button)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
`;
