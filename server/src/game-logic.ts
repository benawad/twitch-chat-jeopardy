import { Template } from "./entities/Template";
import { twitchClient } from "./twitch";
import {
  __chan__,
  __time_multiplier__,
  VOTE_LENGTH,
  PAUSE_LENGTH,
  __game_state__,
  LEADERBOARD_LENGTH,
  QUESTION_LENGTH,
} from "./constants";
import { sleep } from "./utils/sleep";
import { Question } from "./types/TemplateSection";
import { io } from "./websockets";
import debounce from "lodash.debounce";

export enum States {
  nothing,
  collectNumberVotes,
  collectWhoVoted,
}

export let currentTemplate: Template | null = null;
export let state = States.nothing;
export let collectStartTime = new Date().getTime();
export let completeQuestions = new Set();
export let previousVoters = new Set();
export let voteResults: Record<string, number> = {};
export let leaderBoard: Record<string, number> = {};
export let correctAnswer = "";
export let currentQuestionPointValue = 0;
export let questionWinner = "";
export let onNewVote = (computeWinner?: boolean) => {};

const makeOnVote = (
  state: "vote-c" | "vote-p",
  title: string,
  keyValue: Array<[string, string]>
) => (computeWinner?: boolean, countdown?: number) => {
  let maxKey = "";
  let maxValue = -1;
  const total = Object.entries(voteResults).reduce((pv, [key, cv]) => {
    if (cv > maxValue) {
      maxValue = cv;
      maxKey = key;
    }
    return pv + cv;
  }, 0);
  io.emit(__game_state__, {
    state,
    options: keyValue.map(([key, label]) => ({
      label,
      key,
      percent: Math.round((total / voteResults[key]) * 1000) / 10,
      count: voteResults[key],
      isWinner: computeWinner ? maxKey === key : false,
    })),
    title: title,
    countdown: countdown || VOTE_LENGTH,
  });
};

export const setQuestionWinner = (s: string) => {
  questionWinner = s;
};

const setCollectStartTime = () => {
  collectStartTime = new Date().getTime();
};

function assertTemplate(t: Template | null): asserts t is Template {
  if (!t) {
    twitchClient.say(
      __chan__,
      "currentTemplate is null which should never happen which means you wrote buggy code, game will now self destruct... SSSsss"
    );
    throw Error("game is active but currentTemplate is null");
  }
}

export const getVoteWinner = (): [string, number] => {
  let maxValue = -1;
  let maxIdx = "";
  Object.entries(voteResults).forEach(([k, v]) => {
    if (v > maxValue) {
      maxIdx = k;
      maxValue = v;
    }
  });
  return [maxIdx, maxValue];
};

export const askQuestion = async (question: Question) => {
  twitchClient.say(__chan__, `RarePepe ${question.pointValue} points`);

  await sleep(PAUSE_LENGTH);

  currentQuestionPointValue = parseInt(question.pointValue);
  voteResults = {};
  previousVoters.clear();
  questionWinner = "";
  setCollectStartTime();
  state = States.collectWhoVoted;
  question.answers.forEach((a, idx) => {
    const key = "" + idx;
    voteResults[key] = 0;
    if (a.correct) {
      correctAnswer = key;
    }
  });
  io.emit(__game_state__, {
    state: "ask-q",
    question,
    countdown: QUESTION_LENGTH,
  });
  twitchClient.say(
    __chan__,
    `TheIlluminati ${question.text} ${question.answers
      .map((a, idx) => `${idx} -> ${a.text}`)
      .join(" | ")}`
  );
  sleep(QUESTION_LENGTH).then(() => {
    state = States.nothing;
    twitchClient.say(
      __chan__,
      `FrankerZ Congrats to @${questionWinner} for being the first to answer correctly! You get 200 extra points.`
    );
    completeQuestions.add(question.text);
    io.emit(__game_state__, {
      state: "ask-q",
      question,
      winner: questionWinner,
      countdown: PAUSE_LENGTH,
    });
    sleep(PAUSE_LENGTH).then(() => {
      io.emit(__game_state__, {
        state: "leaderboard",
        scores: leaderBoard,
        isGameOver: false,
        countdown: LEADERBOARD_LENGTH,
      });
      sleep(LEADERBOARD_LENGTH).then(() => {
        pickNextCategory();
      });
    });
  });
};

export const pickNextQuestion = async (sectionIdx: string) => {
  assertTemplate(currentTemplate);
  const intIdx = parseInt(sectionIdx);

  const section = currentTemplate.sections[intIdx];

  if (!section) {
    twitchClient.say(
      __chan__,
      "bad sectionIdx which should never happen which means you wrote buggy code, game will now self destruct... SSSsss"
    );
    throw Error("no section ??");
  }

  twitchClient.say(__chan__, `VapeNation next category: ${section.name}`);

  await sleep(PAUSE_LENGTH);

  prepareVoting();
  const possiblePointValues: string[] = [];
  const keyValue: Array<[string, string]> = [];

  section.questions.forEach((q) => {
    if (!completeQuestions.has(q.text)) {
      voteResults[q.pointValue] = 0;
      possiblePointValues.push(q.pointValue);
      keyValue.push([q.pointValue, q.pointValue]);
    }
  });

  if (possiblePointValues.length === 1) {
    twitchClient.say(__chan__, "Only one question left, no vote required.");
    await sleep(PAUSE_LENGTH);
    askQuestion(
      section.questions.find((x) => x.pointValue === possiblePointValues[0])!
    );
  } else {
    const _onNewVote = makeOnVote(
      "vote-p",
      "Vote Point Value for " + section.name,
      keyValue
    );
    onNewVote = debounce(_onNewVote, 1000, { maxWait: 1000 });
    _onNewVote();
    twitchClient.say(
      __chan__,
      `Vote for question: ${possiblePointValues.join(" | ")}`
    );
    sleep(VOTE_LENGTH).then(() => {
      state = States.nothing;
      const [pointValue] = getVoteWinner();
      _onNewVote(true, PAUSE_LENGTH);
      askQuestion(section.questions.find((x) => x.pointValue === pointValue)!);
    });
  }
};

export const gameDone = () => {
  twitchClient.say(__chan__, "game is done " + JSON.stringify(leaderBoard));
  currentTemplate = null;
  completeQuestions.clear();
  io.emit(__game_state__, {
    state: "leaderboard",
    scores: leaderBoard,
    isGameOver: true,
    countdown: -1,
  });
};

export const prepareVoting = () => {
  voteResults = {};
  previousVoters.clear();
  setCollectStartTime();
  state = States.collectNumberVotes;
};

export const pickNextCategory = (first?: boolean) => {
  assertTemplate(currentTemplate);
  prepareVoting();
  const possibleSections: string[] = [];
  const keyValue: Array<[string, string]> = [];
  currentTemplate.sections.forEach((s, idx) => {
    if (s.questions.some((x) => !completeQuestions.has(x.text))) {
      keyValue.push(["" + idx, s.name]);
      possibleSections.push(`${idx} -> ${s.name}`);
      voteResults["" + idx] = 0;
    }
  });
  if (possibleSections.length === 0) {
    gameDone();
  } else if (possibleSections.length === 1) {
    pickNextQuestion(Object.keys(voteResults)[0]);
  } else {
    const _onNewVote = makeOnVote("vote-c", "Vote for Category", keyValue);
    onNewVote = debounce(_onNewVote, 1000, { maxWait: 1000 });
    _onNewVote();
    twitchClient.say(
      __chan__,
      `Vote for the ${
        first ? "first" : "next"
      } category: ${possibleSections.join(" | ")}`
    );
    sleep(VOTE_LENGTH).then(() => {
      state = States.nothing;
      const question = getVoteWinner()[0];
      _onNewVote(true, PAUSE_LENGTH);
      pickNextQuestion(question);
    });
  }
};

export const startGameWithTemplate = (template: Template) => {
  currentTemplate = template;
  io.emit(__game_state__, {
    state: "before",
    countdown: PAUSE_LENGTH,
  });
  twitchClient
    .say(
      __chan__,
      `DoritosChip Twitch Chat Jeopardy is about to begin, prepare yourself for a battle to the death`
    )
    .then(() => sleep(PAUSE_LENGTH))
    .then(() => pickNextCategory(true));
};
