import styled from "styled-components";

export const Label = styled.label`
  display: inline-block;
  position: relative;
  width: 2rem;
  height: 1.2rem;
  border-radius: 1.2rem;
  background: var(--switch-background);
  transition: var(--theme-transition);

  input {
    display: block;
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
  }

  span {
    content: "";
    display: block;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.25s ease;

    box-shadow: var(--box-shadow-1);
    background: var(--switch-handle);
    z-index: 1;
    cursor: pointer;
  }

  span:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }

  input:focus + span {
    outline: var(--outline-style);
  }

  input:checked + span {
    left: 100%;
  }
`;
