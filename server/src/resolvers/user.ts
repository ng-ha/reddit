import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import { TokenModal } from '../models/Token';
import { ChangePasswordInput } from '../types/ChangePasswordInput';
import { Context } from '../types/Context';
import { ForgotPasswordInput } from '../types/ForgotPassword';
import { LoginInput } from '../types/LoginInput';
import { RegisterInput } from '../types/RegisterInput';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { sendEmail } from '../utils/sendEmail';
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
      return { code: 400, success: false, ...validateRegisterInputError };
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

      //create new session by mofify session (automatically saved to db, send header set-cookie to client)
      req.session.userId = newUser.id;

      return {
        code: 200,
        success: true,
        message: 'User registered successfully',
        user: await newUser.save(),
      };
    } catch (error) {
      console.log(error);
      return { code: 500, success: false, message: `Internal server error ${error.message}` };
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

      //create new session by mofify session (automatically saved to db, send header set-cookie to client)
      req.session.userId = existingUser.id;

      return { code: 200, success: true, message: 'Logged in successfully', user: existingUser };
    } catch (error) {
      console.log(error);
      return { code: 500, success: false, message: `Internal server error ${error.message}` };
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

  @Mutation((_returns) => Boolean)
  async forgotPassword(
    @Arg('forgotPasswordInput') { email }: ForgotPasswordInput
  ): Promise<boolean> {
    const user = await User.findOneBy({ email });

    if (!user) return true;

    // find and delete existing token (if exists)
    await TokenModal.findOneAndDelete({ userId: `${user.id}` });

    const resetToken = nanoid();
    const hashedResetToken = await argon2.hash(resetToken);
    await new TokenModal({ userId: `${user.id}`, token: hashedResetToken }).save();
    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password.</>`
    );
    return true;
  }

  @Mutation((_returns) => UserMutationResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('userId') userId: string,
    @Arg('changePasswordInput') { newPassword }: ChangePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    if (newPassword.length <= 2)
      return {
        code: 400,
        success: false,
        message: 'Invalid password',
        errors: [{ field: 'newPassword', message: 'Length must be greater than 2' }],
      };
    try {
      const resetPasswordTokenRecord = await TokenModal.findOne({ userId });
      if (!resetPasswordTokenRecord)
        return {
          code: 400,
          success: false,
          message: 'Expired password reset token (Record not found)',
          errors: [{ field: 'token', message: 'Expired password reset token (Record not found)' }],
        };
      const resetPasswordTokenValid = await argon2.verify(resetPasswordTokenRecord.token, token);
      if (!resetPasswordTokenValid)
        return {
          code: 400,
          success: false,
          message: 'Invalid password reset token',
          errors: [{ field: 'token', message: 'Invalid password reset token' }],
        };
      const user = await User.findOneBy({ id: parseInt(userId) });
      if (!user)
        return {
          code: 400,
          success: false,
          message: 'user no longer exists',
          errors: [{ field: 'token', message: 'User no longer exists' }],
        };
      const hashedNewPassword = await argon2.hash(newPassword);
      await User.update({ id: parseInt(userId) }, { password: hashedNewPassword });
      await resetPasswordTokenRecord.deleteOne();

      //modified session to create session, save to db, send header set-cookie to client
      req.session.userId = user.id;
      return { code: 200, success: true, message: 'User password reset successfully', user };
    } catch (error) {
      console.log(error);
      return { code: 500, success: false, message: `Internal server error ${error.message}` };
    }
  }
}
