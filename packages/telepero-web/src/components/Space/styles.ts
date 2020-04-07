import styled from "styled-components";

export const SpaceLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const HeaderLayout = styled.header`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: 1fr auto auto;
  padding: 2rem;
  background: #000;
  color: #f5f5f5;
  border-bottom: 2px solid #373737;

  h1 {
    font-weight: bold;
    color: #e5e5e5;
  }

  span {
    color: #e5e5e5;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  background: #121212;
`;

export const VideoGrid = styled.div`
  display: grid;
  grid-gap: 1.5rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ControlsLayout = styled.footer`
  padding: 2rem;
  background: #000;
  color: #fff;
  border-top: 2px solid #373737;
  text-align: center;
`;

export const VideoBoxLayout = styled.div`
  border: 0.5rem solid #e5e5e5;
  border-radius: 0.5rem;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 75%;
  background: black;

  > video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > p {
    position: absolute;
    right: -1px;
    bottom: 0;
    display: block;
    padding: 0.5rem 3rem 0.5rem 5rem;
    clip-path: polygon(3rem 0%, 100% 0, 100% 100%, 0% 100%);
    font-weight: bold;
    background: #e5e5e5;
  }
`;

export const LocalVideoBoxLayout = styled(VideoBoxLayout)`
  border-color: #4fd77e;

  > p {
    background: #4fd77e;
    color: #1e5933;
  }
`;
