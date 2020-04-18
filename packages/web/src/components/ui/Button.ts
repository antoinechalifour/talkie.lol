import styled, { css } from "styled-components";

export interface ButtonProps {
  fullwidth?: boolean;
}

const isFullWidth = (props: ButtonProps) => !!props.fullwidth;

export const Button = styled.button<ButtonProps>`
  all: unset;

  box-sizing: border-box;
  border-radius: 1rem;
  padding: 2rem 3rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);

  text-align: center;
  font-family: inherit;
  font-size: inherit;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

  background: linear-gradient(25deg, #3280e9, #f3754d);
  color: #fff;

  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
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
`;
