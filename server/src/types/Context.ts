import { Request, Response } from 'express';
import { SessionData } from 'express-session';
import { Session } from 'express-session';

export type Context = {
  req: Request & { session: Session & Partial<SessionData> & { userId?: number } };

  res: Response;
};
