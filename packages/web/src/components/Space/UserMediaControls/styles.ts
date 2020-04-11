import styled from "styled-components";

export const ToggleMedia = styled.label`
  padding: 0.5rem;
  cursor: pointer;
  display: inline-block;

  span {
    display: inline-block;
    margin-right: 1rem;
  }

  + * {
    margin-left: 2rem;
  }
`;
