const FirebaseErrors = {
  ExpiredToken: 'auth/id-token-expired',
  EmailTaken: 'auth/email-already-exists',
} as const;

export default FirebaseErrors;