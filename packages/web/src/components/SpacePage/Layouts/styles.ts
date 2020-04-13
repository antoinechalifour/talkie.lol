import styled from "styled-components";

export const VideoGrid = styled.div`
  display: grid;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FocusedView = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-gap: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  height: 100%;
`;

export const PeerPreviewList = styled.ul`
  padding: 0 1rem;
  height: 100%;
  overflow-y: auto;

  > li + li {
    margin-top: 2rem;
  }
`;
