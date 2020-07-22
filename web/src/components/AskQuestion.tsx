import React from "react";
import { Question } from "../generated/graphql";
import { Box, Heading, Flex, Alert, AlertIcon } from "@chakra-ui/core";

interface AskQuestionProps {
  question: Question;
  winner?: string;
}

const questionKeys = ["a", "b", "c", "d", "e"];
export const AskQuestion: React.FC<AskQuestionProps> = ({
  question,
  winner,
}) => {
  return (
    <Box>
      <Heading my={8} textAlign="center">
        {question.text}
      </Heading>
      <Flex direction="column" alignItems="center">
        <Box maxW={400} w="100%">
          {question.answers.map((q, i) => {
            const highlight = winner && q.correct;
            return (
              <Flex
                position="relative"
                key={q.text}
                textAlign="left"
                fontWeight={600}
                fontSize={20}
                mb={4}
                w="100%"
                justify="space-between"
                background={highlight ? "green" : "#CBD5E0"}
                color={highlight ? "white" : "black"}
                borderRadius={6}
                px={4}
                py={2}
              >
                <Box zIndex={1}>
                  {questionKeys[i]} -{">"} {q.text}
                </Box>
              </Flex>
            );
          })}
        </Box>
      </Flex>
      {winner ? (
        <Box mt={8}>
          <Alert
            fontSize={24}
            maxW="600px"
            width="100%"
            m="auto"
            status="success"
            textAlign="center"
          >
            Congrats to {winner} who was the first to answer correctly. They get
            200 extra points!
          </Alert>
        </Box>
      ) : null}
    </Box>
  );
};
