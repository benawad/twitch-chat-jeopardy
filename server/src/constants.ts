export const __prod__ = process.env.NODE_ENV == "production";
export const __chan__ = process.env.CHANNEL_NAME;
export const __time_multiplier__ = 1;
export const VOTE_LENGTH = 10000 / __time_multiplier__;
export const QUESTION_LENGTH = 15000 / __time_multiplier__;
export const PAUSE_LENGTH = 3000;
export const LEADERBOARD_LENGTH = 7000;
export const __debug__ = false;
export const __game_state__ = "new-game-state";
