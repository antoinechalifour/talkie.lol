import styled from "styled-components";

export const ConferenceLayout = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: repeat(3, auto);
  color: var(--color-text);
  background-color: var(--background-lighter);
  background-image: var(--background-pattern);

  @media (min-width: 860px) {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr auto;
  }
`;

export const MediaArea = styled.div`
  padding: 2rem;
`;

export const MediaControlsArea = styled.div`
  padding: 2rem;
`;

export const ChatArea = styled.div`
  padding: 2rem;
  background: var(--background-lighter);
  box-shadow: var(--box-shadow-1);

  @media (min-width: 860px) {
    grid-row: 1 / span 2;
    grid-column: 2;
  }
`;
