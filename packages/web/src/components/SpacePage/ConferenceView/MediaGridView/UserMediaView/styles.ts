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

export const LocalNameView = styled.p<UserNameViewProps>`
  position: absolute;
  top: 1rem;
  left: 1rem;

  display: flex;
  padding: 1rem 2rem;
  place-content: center;
  border-radius: 1rem;
  box-shadow: var(--box-shadow-1);

  background: var(--color-blue);
  color: var(--color-white);

  border: 2px solid black;
  transition: border 0.25s ease;

  ${(props) =>
    props.isActive &&
    css`
      border: 2px solid var(--color-green);
    `};
`;

export const UserNameView = styled(LocalNameView)`
  background: rgba(0, 0, 0, 0.7);
`;
