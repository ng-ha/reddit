import { Field, ObjectType } from 'type-graphql';
import { IMutationResponse } from './MutationResponse';
import { User } from '../entities/User';
import { FieldError } from './FieldError';

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
  code: number;
  success: boolean;
  message?: string;

  // @Field(_type => User, { nullable: true })
  @Field({ nullable: true })
  user?: User;

  @Field((_type) => [FieldError], { nullable: true })
  errors?: FieldError[];
}
