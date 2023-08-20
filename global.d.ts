declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_PROD_URI: string;
      MONGODB_DEV_URI: string;
      NODE_ENV: 'production' | 'development';
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_CLIENT_ID: string;
      FIREBASE_AUTH_URI: string;
      FIREBASE_TOKEN_URI: string;
      FIREBASE_AUTH_CERT_URL: string;
      FIREBASE_CLIENT_CERT_URL: string;
      STRIPE_PRIVATE_KEY: string;
    }
  }
}
export {};
