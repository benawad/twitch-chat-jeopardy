import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/core";

interface LeaderboardProps {
  scores: Record<string, number>;
  isGameOver: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  scores,
  isGameOver,
}) => {
  const sortedScores = Object.entries(scores).sort((a, b) => {
    if (a[1] > b[1]) {
      return -1;
    }

    if (a[1] < b[1]) {
      return 1;
    }

    return 0;
  });
  return (
    <Box>
      <Heading my={8} textAlign="center">
        {isGameOver ? "Game Over" : "Leaderboard"}
      </Heading>
      <Flex direction="column" alignItems="center">
        <Box maxW={400} w="100%">
          <Flex
            backgroundColor="#2D3748"
            fontWeight={600}
            fontSize={14}
            color="white"
            p={4}
            width="100%"
            justifyContent="space-between"
          >
            <Box flex={1}>Rank</Box>
            <Box ml={4} flex={3}>
              Username
            </Box>
            <Box flex={1}>Points</Box>
          </Flex>
          {sortedScores.map(([username, score], i) => (
            <Flex
              textAlign="left"
              w="100%"
              background={"#f5f5f5"}
              color={"black"}
              fontSize={18}
              px={4}
              py={2}
              borderBottom="1px solid #fff"
              key={username}
            >
              <Box flex={1}>{i}</Box>
              <Box ml={4} flex={3}>
                {username}
              </Box>
              <Box flex={1}>{score}</Box>
            </Flex>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
