import styled from "styled-components";

export const PageLayout = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  > :nth-child(2) {
    flex: 1;
  }
`;

export const HeaderArea = styled.header`
  padding: 2rem;
  background: #1d2636;
  color: #fff;
`;
