import styled from "styled-components";

export const QrCodeVideoPreview = styled.video`
  display: block;
  box-sizing: border-box;
  object-fit: cover;
  width: 100%;
  max-width: 250px;
  border: 5px solid var(--color-text);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;
