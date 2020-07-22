import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import io from "socket.io-client";
import { useTemplatesQuery, Question } from "../generated/graphql";
import { JeopardyBoard } from "../components/JeopardyBoard";
import { Box, Flex } from "@chakra-ui/core";
import { PickCategory, VoteOption } from "../components/PickCategory";
import { setIn } from "formik";
import { AskQuestion } from "../components/AskQuestion";
import { Leaderboard } from "../components/Leaderboard";
import { Countdown } from "../components/Countdown";

const socket = io("http://localhost:4000");

type LeaderboardState = {
  state: "leaderboard";
  scores: Record<string, number>;
  isGameOver: boolean;
};

type BeforeGameState = {
  state: "before";
};

type VoteState = {
  state: "vote-c" | "vote-p";
  options: Array<VoteOption>;
  title: string;
};

type AskQuestionState = {
  state: "ask-q" | "wait";
  question: Question;
  winner?: string;
};

type States = (
  | AskQuestionState
  | LeaderboardState
  | BeforeGameState
  | VoteState
) & { countdown: number };

interface GameProps {}

export const Game: React.FC<GameProps> = ({}) => {
  const [leaderboard, setLeaderboard] = useState<
    LeaderboardState & { countdown: number }
  >({
    isGameOver: false,
    scores: {},
    state: "leaderboard",
    countdown: -1,
  });
  const [gameState, setGameState] = useState<States>({
    state: "before",
    countdown: -1,
  });
  const {
    params: { templateId },
  } = useRouteMatch<{ templateId: string }>();
  const [{ data }] = useTemplatesQuery();

  const currentTemplate = data?.templates.find((x) => x.id === templateId);

  useEffect(() => {
    socket.on("new-game-state", (state: any) => {
      if (state.state === "leaderboard") {
        setLeaderboard(state);
        setGameState((gs: any) => {
          return { ...gs, state: "wait", countdown: 7000 };
        });
      } else {
        setGameState(state);
      }
    });

    return () => {
      socket.off("new-game-state");
    };
  }, []);

  // const [info, setInfo] = useState([
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  //   [0, 0],
  // ]);

  // useEffect(() => {
  //   setInterval(() => {
  //     const rand = () => Math.floor(Math.random() * 1000);
  //     const values = [rand(), rand(), rand(), rand(), rand()];
  //     const total = values.reduce((pv, cv) => pv + cv, 0);
  //     setInfo(values.map((v) => [Math.round(100 * (v / total)), v]));
  //   }, 500);
  // }, []);

  if (!currentTemplate) {
    return null;
  }

  return (
    <Flex ml={4}>
      <Leaderboard {...leaderboard} />
      <Box flex={1}>
        {gameState.state === "before" ? (
          <JeopardyBoard template={currentTemplate} />
        ) : null}
        {gameState.state === "vote-c" || gameState.state === "vote-p" ? (
          <PickCategory {...gameState} />
        ) : null}
        {gameState.state === "ask-q" || gameState.state === "wait" ? (
          <AskQuestion {...gameState} />
        ) : null}
      </Box>
      <Countdown
        key={gameState.state + gameState.countdown}
        countdown={gameState.countdown}
      />
    </Flex>
  );
};
