import styled from "styled-components/macro";

export const UserMediaLayout = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--background-video);
`;

export const UserTopMenu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto auto;
  grid-gap: 1rem;
  padding: 0.5rem 1rem;

  background: var(--color-black);
  color: var(--color-white);

  transition: all 0.25s ease;
`;

export const SpeakingIconContainer = styled.div`
  color: var(--color-green);
`;
