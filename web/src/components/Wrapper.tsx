import React from "react";
import { Box } from "@chakra-ui/core";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box m="auto" mt={8} maxW="800px" w="100%">
      {children}
    </Box>
  );
};
