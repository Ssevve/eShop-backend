declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NODE_ENV: 'production' | 'development';
    }
  }
}
export {};
