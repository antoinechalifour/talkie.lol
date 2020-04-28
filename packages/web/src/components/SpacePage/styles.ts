import styled from "styled-components/macro";

export const PageLayout = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  > :nth-child(2) {
    flex: 1;
  }
`;
