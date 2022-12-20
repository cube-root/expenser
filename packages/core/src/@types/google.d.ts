export {};

declare global {
  interface GooglePayload {
    name: string;
    picture: string;
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
    firebase: {
      identities: any;
      sign_in_provider: string;
    };
  }
}
