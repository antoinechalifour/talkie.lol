import styled from "styled-components";

export const UserMediaLayout = styled.div`
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.8);
`;

export const UserNameView = styled.p`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  padding: 1rem 2rem;
  place-content: center;
  border-radius: 1rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

  background: #3280e9;
  color: #fff;
`;

export const UserVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: scaleX(-1) translate(50%, -50%);
  max-height: 100%;
  max-width: 100%;
`;
