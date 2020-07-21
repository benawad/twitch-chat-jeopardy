import React from "react";
import { Template, useStartGameMutation } from "../generated/graphql";
import { Grid, Box, Heading, Flex, Button } from "@chakra-ui/core";

interface JeopardyBoardProps {
  template: Template;
}

const cells = Array.from(Array(25));

const values = ["100", "200", "300", "400", "500"];

export const JeopardyBoard: React.FC<JeopardyBoardProps> = ({ template }) => {
  const [{ fetching }, startGame] = useStartGameMutation();
  return (
    <Box>
      <Heading textAlign="center" my={8}>
        {template.title}
        <Button
          isLoading={fetching}
          onClick={() => startGame({ templateId: template.id })}
          variantColor="teal"
          ml={6}
        >
          start
        </Button>
      </Heading>
      <Grid mx={6} templateColumns="repeat(5, 1fr)" gap={6}>
        {cells.map((cell, i) => (
          <Flex
            justifyContent="center"
            alignItems="center"
            color="#fff"
            key={i}
            w="100%"
            h="10"
            bg="blue.500"
          >
            {values[Math.floor(i / 5)]}
          </Flex>
        ))}
        {template.sections.map((s) => (
          <Box fontWeight={600} fontSize={20} textAlign="center" key={s.name}>
            {s.name}
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
