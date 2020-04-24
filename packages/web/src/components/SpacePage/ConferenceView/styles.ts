import styled from "styled-components";

export const ConferenceLayout = styled.div`
  display: grid;
  height: 100%;
  overflow: hidden;
  grid-template-columns: 2fr 1fr;
`;

export const MediaArea = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
`;

export const MediaControlsArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
`;

export const ChatArea = styled.div`
  height: 100%;
  overflow: hidden;
  padding: 2rem;
  background: var(--background-lighter);
  box-shadow: var(--box-shadow-1);
`;
