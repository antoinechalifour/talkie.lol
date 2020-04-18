import styled from "styled-components";

export const ChatLayout = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 2rem;
  height: 100%;
`;

export const MessagesArea = styled.div`
  overflow-y: hidden;
`;

export const NoMessageArea = styled.div`
  height: 100%;
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

  background: var(--background-reverse);

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

    background: var(--button-background);
    color: var(--button-text);
  }

  input:disabled + button {
    cursor: not-allowed;
  }
`;

export const MessagesList = styled.ul`
  height: 100%;
  overflow-y: scroll;
`;

export const MessageLayout = styled.li`
  & + li {
    margin-top: 2rem;
  }

  > * + * {
    margin-top: 0.8rem;
  }
`;

export const AuthorName = styled.div`
  font-size: 1.4rem;
  color: var(--color-lightgray);
  opacity: 0.75;
`;

export const MessageContent = styled.p`
  display: inline-block;
  padding: 2rem;
  border-radius: 1rem;

  background: var(--color-white);
  color: var(--color-text-reverse);
`;

export const ReceivedTime = styled.div`
  font-size: 1.4rem;
  color: var(--color-lightgray);
  opacity: 0.75;
`;
