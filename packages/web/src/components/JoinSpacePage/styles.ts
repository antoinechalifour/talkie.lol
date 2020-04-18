import styled from "styled-components";

import { Button } from "../ui/Button";

export const VideoLayout = styled.div`
  position: relative;
  width: 98%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  background: black;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 20px 20px 60px #0f141c, -20px -20px 60px #1d2634;

  &::after {
    content: "";
    display: block;
    padding-bottom: 75%;
  }

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }
`;

export const JoinButton = styled(Button)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
`;
