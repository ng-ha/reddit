import { useMutation } from '@apollo/client';
import { Box, Button, Flex, Link, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import NextLink from 'next/link';

import { LoginInput, MeDocument, MeQuery } from '../__generated__/graphql';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';
import Wrapper from '../components/Wrapper';
import { loginMutation } from '../graphql-client/mutations/login';
import { mapFieldErrors } from '../helpers/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import { useCheckAuth } from '../utils/useCheckAuth';

const Login = () => {
  const [loginUser] = useMutation(loginMutation);
  const router = useRouter();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const toast = useToast();

  const initialValues: LoginInput = {
    usernameOrEmail: '',
    password: '',
  };
  const onLoginSubmit = async (
    values: LoginInput,
    { setSubmitting, setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: { loginInput: values },
      update: (cache, { data }) => {
        // data: { login: { code, errors, success, message, user}}

        // C1: Read cache
        // const meData = cache.readQuery({
        //   query: gql`
        //     query Me {
        //       me {
        //         id
        //         username
        //         email
        //       }
        //     }
        //   `,
        // });

        // C2: Read cache
        // const meData = cache.readQuery({
        //   query: MeDocument,
        // });
        // => { me: null | user}

        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });

    if (response.data?.login.errors) {
      setErrors(mapFieldErrors(response.data?.login.errors));
    } else if (response.data?.login.user) {
      toast({
        title: `Welcome back ${response.data.login.user.username}!`,
        description: 'Logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      //reset store to reload user-based voteType
      const apolloClient = initializeApollo();
      apolloClient.resetStore();

      router.push('/');
    }
    setSubmitting(false);
  };

  return authLoading || (!authLoading && authData?.me) ? (
    <Flex justifyContent="center" alignItems="center" minH="100vh">
      <Spinner />
    </Flex>
  ) : (
    <>
      <Navbar />
      <Wrapper size="small">
        <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or Email"
                label="Username or Email"
                type="text"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Flex mt={2}>
                <NextLink href="/forgot-password" legacyBehavior>
                  <Link ml="auto">Forgot password?</Link>
                </NextLink>
              </Flex>
              <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default Login;
