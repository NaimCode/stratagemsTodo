interface UserSessionData extends SessionData {
  user: {
    userId: string;
    sessionId: string;
  };
}

declare module "express-session" {
  interface Session {
    user: {
      userId: string;
      sessionId: string;
    };
  }
}
