import { client as createClient } from "tmi.js";
import {
  state,
  States,
  collectStartTime,
  previousVoters,
  voteResults,
  correctAnswer,
  leaderBoard,
  currentQuestionPointValue,
  questionWinner,
  setQuestionWinner,
  onNewVote,
} from "./game-logic";

export const twitchClient = createClient({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
});

// Register our event handlers (defined below)
twitchClient.on("message", (target, _context, msg, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot

  if (state === States.collectNumberVotes) {
    if (
      !(msg in voteResults) ||
      parseInt(_context["tmi-sent-ts"] || "0") < collectStartTime ||
      !_context["display-name"] ||
      previousVoters.has(_context["display-name"])
    ) {
      return;
    }

    previousVoters.add(_context["display-name"]);
    voteResults[msg]++;
    onNewVote();
    return;
  }

  if (state === States.collectWhoVoted) {
    if (!(msg in voteResults)) {
      return;
    }

    const timestamp = parseInt(_context["tmi-sent-ts"] || "0");
    const displayName = _context["display-name"];
    if (
      timestamp < collectStartTime ||
      !displayName ||
      previousVoters.has(_context["display-name"])
    ) {
      return;
    }
    previousVoters.add(displayName);
    if (!(displayName in leaderBoard)) {
      leaderBoard[displayName] = 0;
    }
    if (correctAnswer === msg) {
      let isWinner = false;
      if (!questionWinner) {
        isWinner = true;
        setQuestionWinner(displayName);
      }
      voteResults[msg]++;

      leaderBoard[displayName] +=
        Math.ceil(
          currentQuestionPointValue /
            Math.min(1, Math.floor((timestamp - collectStartTime) * 1000))
        ) + (isWinner ? 200 : 0);
    } else {
      leaderBoard[displayName] = Math.max(0, leaderBoard[displayName] - 50);
    }
    return;
  }
});

twitchClient.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

// Connect to Twitch:
twitchClient.connect();
