export const fadeIn = {
  orchestratorVariants: {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  variants: {
    start: {
      opacity: 0,
    },
    end: {
      opacity: 1,
    },
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};
