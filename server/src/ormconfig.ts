import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Upvote } from './entities/Upvote';
import { __prod__ } from './constants';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(__prod__
    ? {
        url: process.env.DATABASE_URL,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {
        host: 'localhost',
        port: 5432,
        username: process.env.DB_USERNAME_DEV, // change to direct value to generate migration
        password: process.env.DB_PASSWORD_DEV, // change to direct value to generate migration
        synchronize: true, // scheme auto created on every app lauch
      }),
  logging: true,
  database: 'reddit',
  entities: [User, Post, Upvote],
  migrations: [path.join(__dirname, '/migrations/*')],
});

//for generate migration
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: process.env.DB_USERNAME_DEV, // change to direct value to generate migration
//   password: process.env.DB_PASSWORD_DEV, // change to direct value to generate migration
//   logging: true,
//   database: 'reddit-for-migrations',
//   entities: [User, Post, Upvote],
//   migrations: ['dist/migrations/*.js'],
// });
