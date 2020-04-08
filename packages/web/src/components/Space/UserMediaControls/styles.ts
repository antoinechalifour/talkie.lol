import styled from "styled-components";

export const ToggleMedia = styled.label`
  padding: 0.5rem;
  cursor: pointer;

  input {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap; /* added line */
  }

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-text-darker);
    border-radius: 50%;
    color: var(--color-text-darker);

    height: 50px;
    width: 50px;

    transform: scale(1);
    transition: transform 0.3s;
  }

  input:focus + span {
    transform: scale(1.05);
  }

  input:checked + span {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
`;
