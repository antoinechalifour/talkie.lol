import styled from "styled-components";

export const Background = styled.main`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
`;

export const AppTitle = styled.h1`
  font-size: 5.5rem;
  letter-spacing: 0.5rem;
  font-family: var(--font-secondary);
  margin-bottom: 3rem;

  color: var(--color-text);
  text-shadow: 0 1px 12px #000;

  @media (min-width: 860px) {
    font-size: 8rem;
  }
`;
