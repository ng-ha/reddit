require('dotenv').config();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';

import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    database: 'reddit',
    username: process.env.DB_USENAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });
  await AppDataSource.initialize();

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: await buildSchema({ resolvers: [HelloResolver, UserResolver] }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use('/', cors(), bodyParser.json(), expressMiddleware(server));

  const PORT = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve as () => void));

  console.log(`Server ready at http://localhost:${PORT}/`);
};

main().catch(console.log);
