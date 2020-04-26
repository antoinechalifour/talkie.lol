import styled from "styled-components/macro";
import { motion } from "framer-motion";

export const DropdownGroup = styled.div`
  position: relative;
`;

export const DropdownLayout = styled.div`
  display: flex;

  button {
    all: unset;

    display: flex;
    place-content: center;
    height: 50px;
    width: 50px;
    border-radius: 1rem;

    background: var(--button-background);
    color: var(--color-white);

    cursor: pointer;
  }

  button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 30px;

    svg {
      // This specific icon is not aligned
      transform: translateY(-25%);
    }

    &[aria-expanded="true"] {
      background: var(--color-dark-blue);
    }
  }
`;

export const DropdownMenuLayout = styled(motion.div)`
  position: absolute;
  z-index: 10000;
  bottom: 50%;
  left: calc(100% - 2rem);
  min-width: 15rem;
  padding: 1rem 0;
  border-radius: 0.5rem;

  background: var(--color-white);
  color: var(--color-text-reverse);
  box-shadow: var(--box-shadow-1);
  transform-origin: 0 100%;
`;

export const OptionButton = styled.button`
  all: unset;
  display: block;
  box-sizing: border-box;
  width: 100%;
  white-space: nowrap;
  padding: 1rem;
  cursor: pointer;

  &:hover,
  &:focus {
    background: var(--color-lightgray);
  }
`;
