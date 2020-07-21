import { Template } from "./entities/Template";
import { twitchClient } from "./twitch";
import {
  __chan__,
  __time_multiplier__,
  VOTE_LENGTH,
  PAUSE_LENGTH,
} from "./constants";
import { sleep } from "./utils/sleep";
import { Question } from "./types/TemplateSection";

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
  twitchClient.say(
    __chan__,
    `TheIlluminati ${question.text} ${question.answers
      .map((a, idx) => `${idx} -> ${a.text}`)
      .join(" | ")}`
  );
  sleep(VOTE_LENGTH).then(() => {
    state = States.nothing;
    twitchClient.say(
      __chan__,
      `FrankerZ Congrats to @${questionWinner} for being the first to answer correctly! You get 200 extra points.`
    );
    completeQuestions.add(question.text);
    sleep(PAUSE_LENGTH).then(() => {
      pickNextCategory();
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

  section.questions.forEach((q) => {
    if (!completeQuestions.has(q.text)) {
      voteResults[q.pointValue] = 0;
      possiblePointValues.push(q.pointValue);
    }
  });

  if (possiblePointValues.length === 1) {
    twitchClient.say(__chan__, "Only one question left, no vote required.");
    await sleep(PAUSE_LENGTH);
    askQuestion(
      section.questions.find((x) => x.pointValue === possiblePointValues[0])!
    );
  } else {
    twitchClient.say(
      __chan__,
      `Vote for question: ${possiblePointValues.join(" | ")}`
    );
    sleep(VOTE_LENGTH).then(() => {
      state = States.nothing;
      const [pointValue] = getVoteWinner();
      askQuestion(section.questions.find((x) => x.pointValue === pointValue)!);
    });
  }
};

export const gameDone = () => {
  twitchClient.say(__chan__, "game is done " + JSON.stringify(leaderBoard));
  currentTemplate = null;
  completeQuestions.clear();
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
  currentTemplate.sections.forEach((s, idx) => {
    if (s.questions.some((x) => !completeQuestions.has(x.text))) {
      possibleSections.push(`${idx} -> ${s.name}`);
      voteResults["" + idx] = 0;
    }
  });
  if (possibleSections.length === 0) {
    gameDone();
  } else if (possibleSections.length === 1) {
    pickNextQuestion(Object.keys(voteResults)[0]);
  } else {
    twitchClient.say(
      __chan__,
      `Vote for the ${
        first ? "first" : "next"
      } category: ${possibleSections.join(" | ")}`
    );
    sleep(VOTE_LENGTH).then(() => {
      state = States.nothing;
      const question = getVoteWinner()[0];
      pickNextQuestion(question);
    });
  }
};

export const startGameWithTemplate = (template: Template) => {
  currentTemplate = template;
  twitchClient
    .say(
      __chan__,
      `DoritosChip Twitch Chat Jeopardy is about to begin, prepare yourself for a battle to the death`
    )
    .then(() => sleep(10000 / __time_multiplier__))
    .then(() => pickNextCategory(true));
};
