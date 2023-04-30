import { FieldError } from '../__generated__/graphql';

export const mapFieldErrors = (errors: FieldError[]) =>
  errors.reduce(
    (accumulatedErrorobject, error) => ({
      ...accumulatedErrorobject,
      [error.field]: error.message,
    }),
    {}
  );
// [
//   {field: 'username', message: 'some error'}
// ]
// => { username: 'some error'}
