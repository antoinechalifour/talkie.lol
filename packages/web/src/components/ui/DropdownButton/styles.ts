import styled from "styled-components";

export const DropdownGroup = styled.div`
  position: relative;
`;

export const DropdownLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);

  button {
    all: unset;

    display: flex;
    place-content: center;
    height: 50px;
    width: 50px;
    border-radius: 1rem;

    background: #3280e9;
    color: #fff;

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
      background: #3157ac;
    }
  }
`;

export const DropdownMenuLayout = styled.div`
  position: absolute;
  z-index: 10000;
  bottom: 50%;
  left: calc(100% - 2rem);
  min-width: 15rem;
  padding: 1rem 0;
  border-radius: 0.5rem;

  background: #fff;
  color: #373737;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
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
    background: #ddd;
  }
`;
