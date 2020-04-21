import styled, { keyframes } from "styled-components";

export const LocalUserLayout = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  &::after {
    content: "";
    display: block;
    padding-bottom: 75%;
  }
`;

export const DualStreamLayout = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;

  &::after {
    content: "";
    display: block;
    padding-bottom: 75%;
  }

  > :last-child {
    position: absolute;
    width: 33%;
    bottom: 2px;
    right: 2px;

    p {
      display: none;
    }

    &::after {
      content: "";
      display: block;
      padding-bottom: 75%;
    }
  }
`;

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
