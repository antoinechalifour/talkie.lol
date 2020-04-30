import styled, { css, keyframes } from "styled-components";

export interface ButtonProps {
  fullwidth?: boolean;
  loading?: boolean;
}

const isFullWidth = (props: ButtonProps) => !!props.fullwidth;
const isLoading = (props: ButtonProps) => !!props.loading;

const loadingPlaceholderAnimation = keyframes`
  from {
    left: -50%;
  }
  to {
    left: 150%;
  }
`;

export const Button = styled.button<ButtonProps>`
  all: unset;

  box-sizing: border-box;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: var(--box-shadow-1);

  text-align: center;
  font-family: inherit;
  font-size: inherit;
  text-shadow: var(--button-text-shadow);

  background: var(--button-background-gradient);
  color: var(--button-text);

  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: var(--box-shadow-2);
  }

  &:focus {
    outline: var(--outline-style);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.8;
  }

  ${(props) =>
    isFullWidth(props) &&
    css`
      display: block;
      width: 100%;
    `};

  ${(props) =>
    isLoading(props) &&
    css`
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        display: block;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;

        animation: ${loadingPlaceholderAnimation} 1.5s forwards infinite;
        background: linear-gradient(
          to right,
          transparent 0%,
          rgba(255, 255, 255, 0.5) 33%,
          transparent 66%
        );
      }
    `};
`;
