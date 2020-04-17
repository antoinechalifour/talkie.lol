import styled from "styled-components";

export const MediaGridLayout = styled.div`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
`;

export const MediaArea = styled.div`
  padding-bottom: 75%;
  position: relative;
  box-shadow: 20px 20px 60px #0f141c, -20px -20px 60px #1d2634;
  border-radius: 1rem;
`;
