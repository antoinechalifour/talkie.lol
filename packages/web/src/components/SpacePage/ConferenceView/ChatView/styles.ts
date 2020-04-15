import styled from "styled-components";

export const ChatLayout = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

export const MessagesArea = styled.div`
  overflow-y: scroll;

  // Temporary while the chat is not ready
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 6rem;
    opacity: 0.25;
    margin-bottom: 2rem;
  }
`;

export const NewMessageArea = styled.div``;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;

  border-radius: 1rem;
  overflow: hidden;

  background: #fff;

  input,
  button {
    height: 50px;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    padding: 0 2rem;
  }

  input:disabled {
    cursor: not-allowed;
  }

  button {
    all: unset;

    display: flex;
    place-content: center;
    width: 50px;

    background: #3280e9;
    color: #fff;
  }

  input:disabled + button {
    cursor: not-allowed;
  }
`;
