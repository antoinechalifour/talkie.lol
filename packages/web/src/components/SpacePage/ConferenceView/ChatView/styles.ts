import styled from "styled-components/macro";
import { motion } from "framer-motion";

export const ChatLayout = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
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

export const NewMessageArea = styled.div`
  padding: 0 1rem 1rem;
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;

  border-radius: 1rem;
  overflow: hidden;

  background: var(--input-text-background);
  transition: var(--theme-transition);

  input,
  button {
    height: 50px;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    padding: 0 2rem;
    border: none;
    outline: none;
    background: none;
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
    color: #fff;

    &:focus {
      outline: var(--outline-style);
    }
  }

  input:disabled + button {
    cursor: not-allowed;
  }
`;

export const MessagesList = styled.ul`
  height: 100%;
  overflow-y: scroll;
  padding: 2rem;
`;

export const MessageLayout = styled(motion.li)`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-template-areas: "time author" "message message";
  grid-gap: 1rem;

  & + li {
    margin-top: 2rem;
  }
`;

export const AuthorName = styled.div`
  grid-area: author;
  font-size: 1.4rem;
  color: var(--color-text-light);
  opacity: 0.75;
`;

export const MessageContent = styled.div`
  grid-area: message;
  display: inline-block;

  > img,
  > p {
    display: inline-block;
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid var(--chat-background);

    background: var(--chat-background);
  }

  > img {
    max-width: 100%;
  }

  > p {
    min-width: 100px;
    color: var(--color-darkgray);
    padding: 1rem 2rem;
  }
`;

export const ReceivedTime = styled.div`
  grid-area: time;
  font-size: 1.4rem;
  color: var(--color-text-light);
  opacity: 0.75;
`;

export const FilePreview = styled.button`
  all: unset;
  cursor: pointer;

  &:focus {
    outline: var(--outline-style);
  }

  > span {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 1rem;
    align-items: center;
    overflow: hidden;

    background: #eee;
    color: var(--color-darkgray);
    border-left: 4px solid var(--color-red);
    padding: 1rem;
  }

  > span p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const tooltipStyle = {
  background: "var(--color-black)",
  color: "var(--color-white)",
  padding: "1rem",
  borderRadius: "0.5rem",
};
