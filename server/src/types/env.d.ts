declare namespace NodeJS {
  export interface ProcessEnv {
    BOT_USERNAME: string;
    CHANNEL_NAME: string;
    OAUTH_TOKEN: string;
    REDIS_URL: string;
    SESSION_SECRET: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
  }
}
