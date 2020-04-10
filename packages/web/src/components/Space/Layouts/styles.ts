import styled from "styled-components";

export const VideoGrid = styled.div`
  display: grid;
  grid-gap: 1.5rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FocusedLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;

  height: 100%;
`;

export const PeerPreviewList = styled.ul`
  padding: 1rem;
  height: 100%;
  overflow-y: auto;

  > li + li {
    margin-top: 2rem;
  }
`;
