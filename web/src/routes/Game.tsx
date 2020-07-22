import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import io from "socket.io-client";
import { useTemplatesQuery, Question } from "../generated/graphql";
import { JeopardyBoard } from "../components/JeopardyBoard";
import { Box } from "@chakra-ui/core";
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
  state: "ask-q";
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
      setGameState(state);
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
    <Box>
      {gameState.state === "before" ? (
        <JeopardyBoard template={currentTemplate} />
      ) : null}
      {gameState.state === "vote-c" || gameState.state === "vote-p" ? (
        <PickCategory {...gameState} />
      ) : null}
      {gameState.state === "ask-q" ? <AskQuestion {...gameState} /> : null}
      {gameState.state === "leaderboard" ? (
        <Leaderboard {...gameState} />
      ) : null}
      <Countdown
        key={gameState.state + gameState.countdown}
        countdown={gameState.countdown}
      />
    </Box>
  );
};
