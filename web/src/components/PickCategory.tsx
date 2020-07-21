import React from "react";
import { Heading, Box, Flex } from "@chakra-ui/core";
import styled from "@emotion/styled";

export type VoteOption = {
  label: string;
  percent: number;
  count: number;
  key: string;
  isWinner: boolean;
};

interface PickCategoryProps {
  options: Array<VoteOption>;
  title: string;
}

const CustomProgress = styled(Flex)<{ percent: number; isWinner: boolean }>`
  &:after {
    content: "";
    position: absolute;
    background: ${(p) => (p.isWinner ? "#ED8936" : "#fbd38d")};
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(p) => p.percent}%;
    transition: all 1s;
    -webkit-transition: all 1s;
    border-radius: 6px;
  }
`;

export const PickCategory: React.FC<PickCategoryProps> = ({
  options,
  title,
}) => {
  return (
    <Box>
      <Heading textAlign="center" my={8}>
        {title}
      </Heading>
      <Flex direction="column" alignItems="center">
        <Box maxW={400} w="100%">
          {options.map((o) => (
            <CustomProgress
              position="relative"
              key={o.key}
              textAlign="left"
              fontWeight={600}
              fontSize={20}
              mb={4}
              w="100%"
              justify="space-between"
              background="#CBD5E0"
              borderRadius={6}
              px={4}
              py={2}
              percent={o.percent}
              isWinner={o.isWinner}
            >
              <Box zIndex={1}>
                {o.key} -{">"} {o.label}
              </Box>{" "}
              <Box zIndex={1}>
                {o.percent}% ({o.count})
              </Box>
            </CustomProgress>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
