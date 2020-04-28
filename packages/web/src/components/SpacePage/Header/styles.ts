import styled, { css } from "styled-components";

import { ConnectionType } from "../../../utils/connectionType";

export const HeaderLayout = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;

  font-family: var(--font-secondary);
  background: var(--background-darker);
  color: var(--color-text);
  box-shadow: var(--box-shadow-2);
`;

export interface ConnectionTypeIconProps {
  connectionType: ConnectionType;
}

export const ConnectionTypeIcon = styled.div`
  position:relative;
  color: var(--color-green);
  transition: color .25s ease;
  
  &:after {
    content: "";
    position: absolute;
    top: 45%;
    left: 50%;
    width: 0;
    height: 0;
    transition: all .2s ease;
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  

  ${(props: ConnectionTypeIconProps) =>
    props.connectionType === "offline" &&
    css`
      color: var(--color-red);

      &:after {
        width: 115%;
        height: 2px;
        background: var(--color-red);
        opacity: 1;
        transform: translate(-50%, -50%) rotate(45deg);
        border: 2px solid var(--background-darker);
      }
    `}
    
  ${(props: ConnectionTypeIconProps) =>
    props.connectionType === "slow" &&
    css`
      color: var(--color-red);
    `}
  
  ${(props: ConnectionTypeIconProps) =>
    props.connectionType === "medium" &&
    css`
      color: var(--color-orange);
    `}
`;
