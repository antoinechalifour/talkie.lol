import styled from "styled-components";

export const MediaControlsLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-gap: 2rem;
`;

export const MediaControlsButton = styled.button`
  all: unset;

  display: flex;
  place-content: center;
  height: 50px;
  width: 50px;
  border-radius: 1rem;

  background: #3280e9;
  color: #fff;

  cursor: pointer;
  transform: scale(1);
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const CancelButton = styled(MediaControlsButton)`
  background: #ff4c4c;
  align-self: end;
`;
