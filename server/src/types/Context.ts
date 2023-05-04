import { Request, Response } from 'express';
import { SessionData } from 'express-session';
import { Session } from 'express-session';
import { DataSource } from 'typeorm';
import { buildDataLoaders } from '../utils/dataLoaders';

export type Context = {
  req: Request & { session: Session & Partial<SessionData> & { userId?: number } };
  res: Response;
  AppDataSource: DataSource;
  dataLoaders: ReturnType<typeof buildDataLoaders>;
};
