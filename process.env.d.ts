declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET?: string;
    DATABASE_URL?: string;
    FLOOT_DATABASE_URL?: string;
    VAPID_PUBLIC_KEY?: string;
    VAPID_PRIVATE_KEY?: string;
    VAPID_SUBJECT?: string;
    NODE_ENV?: string;
    PORT?: string;
  }
}
