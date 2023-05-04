import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Upvote } from './entities/Upvote';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '4278',
  logging: true,
  database: 'reddit-for-migrations',
  entities: [User, Post, Upvote],
  migrations: ['dist/migrations/*.js'],
});
