import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import { Context } from '../types/Context';
import { LoginInput } from '../types/LoginInput';
import { RegisterInput } from '../types/RegisterInput';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { validateRegisterInput } from '../utils/validateRegisterInput';

@Resolver()
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null> {
    if (!req.session.userId) return null;
    return await User.findOneBy({ id: req.session.userId });
  }

  @Mutation((_returns) => UserMutationResponse)
  async register(
    @Arg('registerInput') { username, email, password }: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validateRegisterInputError = validateRegisterInput({ username, email, password });
    if (validateRegisterInputError !== null)
      return {
        code: 400,
        success: false,
        ...validateRegisterInputError,
      };
    try {
      const existingUser = await User.findOne({ where: [{ username }, { email }] });
      if (existingUser)
        return {
          code: 400,
          success: false,
          message: 'Duplicated username or email',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${existingUser.username === username ? 'Username' : 'Email'} already taken`,
            },
          ],
        };

      //pass check, create new user
      const hashedPassword = await argon2.hash(password);
      let newUser = await User.create({ username, password: hashedPassword, email }).save();

      req.session.userId = newUser.id;

      return {
        code: 200,
        success: true,
        message: 'User registered successfully',
        user: await newUser.save(),
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_returns) => UserMutationResponse)
  async login(
    @Arg('loginInput') { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOneBy(
        usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
      );

      if (!existingUser)
        return {
          code: 400,
          success: false,
          message: 'User not found',
          errors: [{ field: 'usernameOrEmail', message: 'Username or email incorrect' }],
        };
      const passwordValid = await argon2.verify(existingUser.password, password);

      if (!passwordValid)
        return {
          code: 400,
          success: false,
          message: 'Wrong password',
          errors: [{ field: 'password', message: 'Wrong password' }],
        };

      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: 'Logged in successfully',
        user: existingUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation((_returns) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);

      req.session.destroy((error) => {
        if (error) {
          console.log('Destroy session  error: ', error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
