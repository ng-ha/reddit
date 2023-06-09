require('dotenv').config();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { COOKIE_NAME, __prod__ } from './constants';
import { AppDataSource } from './ormconfig';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { buildDataLoaders } from './utils/dataLoaders';

const main = async () => {
  await AppDataSource.initialize();
  if (__prod__) await AppDataSource.runMigrations();

  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.ensnrm2.mongodb.net/Reddit?retryWrites=true&w=majority`;
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connected!');

  const app = express();
  const httpServer = http.createServer(app);

  app.set('trust proxy', 1);
  app.use(
    session({
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // don't save empty sessions right from start
      resave: false, // don't save sessions if unmodified
      cookie: {
        maxAge: 1000 * 60 * 60, // one hour
        httpOnly: true, // JS Front-end cannot access the cookie
        secure: __prod__, // cookie only works in https
        sameSite: __prod__ ? 'none' : 'lax', // protection against CSRF
        // domain: __prod__ ? '.vercel.app' : undefined // THIS MAKES ERROR domain='.onrender.com'
      },
      store: MongoStore.create({
        mongoUrl,
      }),
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    '/',
    cors({
      origin: __prod__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        AppDataSource,
        dataLoaders: buildDataLoaders(),
      }),
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve as () => void));

  console.log(`Server ready at http://localhost:${PORT}/`);
};

main().catch(console.log);
