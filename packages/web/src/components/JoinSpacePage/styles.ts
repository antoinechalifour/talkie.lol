import styled from "styled-components/macro";

import { VideoAspectRatioContainer } from "../ui/VideoAspectRatioContainer";
import { InputButtonGroup } from "../ui/InputButtonGroup";

export const JoinSpacelayout = styled.div`
  padding-top: 5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    text-align: center;
    font-size: 4rem;

    &:after {
      content: "";
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      max-width: 200px;
      height: 1px;
      margin-top: 4rem;

      background: var(--color-white);
      opacity: 0.3;
    }
  }
`;

export const VideoLayout = styled(VideoAspectRatioContainer)`
  width: 100%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #000;

  background: var(--background-video);
  box-shadow: var(--box-shadow);
`;

export const JoinInputGroup = styled(InputButtonGroup)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
`;
