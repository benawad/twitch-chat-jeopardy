export const __prod__ = process.env.NODE_ENV == "production";
export const __chan__ = process.env.CHANNEL_NAME;
export const __time_multiplier__ = 5;
export const VOTE_LENGTH = 20000 / __time_multiplier__;
export const PAUSE_LENGTH = 3000;
export const __debug__ = false;
