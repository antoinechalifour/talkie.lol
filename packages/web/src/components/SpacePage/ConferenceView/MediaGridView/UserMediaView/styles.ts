import styled, { css } from "styled-components";

export const UserMediaLayout = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--color-black);
`;

export interface UserNameViewProps {
  isActive: boolean;
}

export const LocalTopMenu = styled.div<UserNameViewProps>`
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;

  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto;
  grid-gap: 1rem;
  padding: 0.5rem 1rem;

  background: rgba(0, 0, 0, 0.85);
  color: var(--color-white);

  transition: all 0.25s ease;

  ${(props) =>
    props.isActive &&
    css`
      background: var(--color-green);
      color: var(--color-text-reverse);
    `};
`;

export const UserTopMenu = styled(LocalTopMenu)`
  background: rgba(0, 0, 0, 0.7);
`;
