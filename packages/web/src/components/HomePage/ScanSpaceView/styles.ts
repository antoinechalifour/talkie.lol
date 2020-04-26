import styled from "styled-components/macro";

export const QrCodeVideoPreview = styled.video`
  object-fit: cover;
  transform: translate(-50%, -50%) !important;
  box-shadow: var(--box-shadow);
  border: 2px solid var(--color-black);
`;
