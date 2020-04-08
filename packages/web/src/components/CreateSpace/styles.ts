import styled from "styled-components";

export const Background = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
`;

export const AppTitle = styled.h1`
  font-size: 8rem;
  letter-spacing: 0.5rem;
  font-family: var(--font-secondary);
  margin-bottom: 3rem;

  color: var(--color-text);
  text-shadow: 0 1px 12px #000;
`;

export const Button = styled.button`
  all: unset;

  padding: 2rem 4rem;
  border-radius: 1rem;
  border: 2px solid #000;
  border-bottom-width: 5px;

  background: var(--color-background-darker);
  color: var(--color-text);

  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
`;
