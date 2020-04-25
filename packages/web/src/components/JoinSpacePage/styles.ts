import styled from "styled-components/macro";

import { VideoAspectRatioContainer } from "../ui/VideoAspectRatioContainer";

export const VideoLayout = styled(VideoAspectRatioContainer)`
  width: 98%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  background: var(--background-video);
  box-shadow: var(--box-shadow);
`;

export const JoinInputGroup = styled.form`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;

  display: grid;
  grid-template-columns: 1fr auto;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  text-align: left;

  input {
    all: unset;
    color: var(--color-text-reverse);
    padding: 0 2rem;
    font-family: inherit;
    font-size: inherit;
  }

  button {
    box-shadow: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
