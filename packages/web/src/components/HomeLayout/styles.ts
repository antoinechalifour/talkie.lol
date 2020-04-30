import styled from "styled-components/macro";
import { motion } from "framer-motion";

export const Page = styled(motion.main)`
  min-height: 100vh;
  padding-top: 10rem;

  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

export const PageContent = styled(motion.div)`
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  a {
    text-align: center;
  }
`;

export const AppTitle = styled(motion.h1)`
  margin-bottom: 5rem;

  font-size: 8rem;
  letter-spacing: 0.5rem;
  font-family: var(--font-secondary);
  text-shadow: var(--text-shadow-app-title);
  text-align: center;

  &:after {
    content: "";
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 200px;
    height: 1px;
    margin-top: 5rem;

    background: var(--color-white);
    opacity: 0.3;
  }
`;
