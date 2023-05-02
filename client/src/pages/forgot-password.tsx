import { Alert, AlertIcon, AlertTitle, Button, Flex, Link, Spinner } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useMutation } from '@apollo/client';
import NextLink from 'next/link';

import { ForgotPasswordInput } from '../__generated__/graphql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { forgotPasswordMutation } from '../graphql-client/mutations/forgotPassword';
import { useCheckAuth } from '../utils/useCheckAuth';

const ForgotPassword = () => {
  const [forgotPassword, { loading, data }] = useMutation(forgotPasswordMutation);
  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: ForgotPasswordInput = { email: '' };

  const onForgotPasswordSubmit = async (
    values: ForgotPasswordInput,
    { setSubmitting }: FormikHelpers<ForgotPasswordInput>
  ) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
    setSubmitting(false);
  };

  if (authLoading || (!authLoading && authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else {
    return (
      <Wrapper size="small">
        <Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
          {({ isSubmitting }) =>
            !loading && data?.forgotPassword ? (
              <Wrapper size="small">
                <Alert status="success" variant="subtle">
                  <AlertIcon />
                  <AlertTitle>Please check your inbox!</AlertTitle>
                </Alert>
                <Flex mt={4}>
                  <NextLink href="/login" legacyBehavior>
                    <Link ml="auto">Back to login</Link>
                  </NextLink>
                </Flex>
              </Wrapper>
            ) : (
              <Form>
                <InputField name="email" placeholder="Email" label="Email" type="email" />
                <Flex mt={2}>
                  <NextLink href="/login" legacyBehavior>
                    <Link ml="auto">Back to Login</Link>
                  </NextLink>
                </Flex>
                <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                  Send Reset Password Email
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
  }
};

export default ForgotPassword;
