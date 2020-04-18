import styled from "styled-components";

export const ConferenceLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr auto;
  height: 100%;
  color: var(--color-text);
  background-color: var(--background-lighter);
  background-image: var(--background-pattern);
`;

export const MediaArea = styled.div`
  padding: 2rem;
`;

export const MediaControlsArea = styled.div`
  padding: 2rem;
`;

export const ChatArea = styled.div`
  grid-row: 1 / span 2;
  grid-column: 2;
  padding: 2rem;
  background: var(--background-lighter);
  box-shadow: var(--box-shadow-1);
`;
