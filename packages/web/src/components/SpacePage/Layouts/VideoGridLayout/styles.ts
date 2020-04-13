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
