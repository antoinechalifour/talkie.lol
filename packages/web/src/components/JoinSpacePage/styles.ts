import styled from "styled-components/macro";

import { VideoAspectRatioContainer } from "../ui/VideoAspectRatioContainer";

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
  width: 98%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #000;

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
