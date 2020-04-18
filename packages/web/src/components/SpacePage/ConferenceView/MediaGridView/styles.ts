import styled, { keyframes } from "styled-components";

export const MediaGridLayout = styled.div`
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-gap: 2rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const mediaEnterAnimation = keyframes`
  from {
    transform: perspective(500px) translateZ(50px);
    opacity: 0;
  }
  to {
    transform: perspective(500px) translateZ(0);
    opacity: 1;
  }
`;

export const MediaArea = styled.div`
  padding-bottom: 75%;
  position: relative;
  box-shadow: var(--box-shadow);
  border-radius: 1rem;

  animation: ${mediaEnterAnimation} 0.25s ease;
`;
