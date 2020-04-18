import styled from "styled-components";

export const StreamOptionsLayout = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  text-align: right;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent);
`;

export const OptionLabel = styled.label`
  cursor: pointer;

  & + label {
    margin-left: 1rem;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap; /* added line */
    border: 0;
  }

  input:checked + * {
    color: var(--input-active-background);
  }
`;
