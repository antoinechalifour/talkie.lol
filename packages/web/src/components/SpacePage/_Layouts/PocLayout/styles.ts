import styled from "styled-components";

export const PageLayout = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 2fr 1fr;
`;

export const VideoArea = styled.div`
  padding: 2rem;
  background: #161d28;
`;

export const VideoGrid = styled.div`
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;

  > :first-child {
    grid-column: 1 / span 3;
    padding-bottom: 40%;
  }

  > :not(:first-child) {
    padding-bottom: 75%;
  }

  // Temporary placeholder
  > div {
    padding: 2rem;
    background: green;
    opacity: 0.5;
    border-radius: 1rem;
    margin: 1rem;
  }
`;

export const ChatArea = styled.div`
  background: #252f43;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
`;
