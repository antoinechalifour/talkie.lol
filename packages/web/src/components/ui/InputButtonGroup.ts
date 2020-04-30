import styled from "styled-components";

export const InputButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  text-align: left;

  input {
    all: unset;
    color: var(--color-text-reverse);
    padding: 0 2rem;
    font-family: inherit;
    font-size: inherit;
  }

  button {
    box-shadow: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
