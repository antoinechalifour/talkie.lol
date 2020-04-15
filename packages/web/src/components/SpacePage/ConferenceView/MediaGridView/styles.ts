import styled from "styled-components";

export const MediaGridLayout = styled.div`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
`;

const BaseMediaArea = styled.div`
  position: relative;
  box-shadow: 20px 20px 60px #0f141c, -20px -20px 60px #1d2634;
  border-radius: 1rem;
`;

export const MainMediaArea = styled(BaseMediaArea)`
  grid-column: 1 / span 3;
  padding-bottom: 50%;
`;

export const MediaArea = styled(BaseMediaArea)`
  padding-bottom: 75%;
`;
