import { useMutation } from '@apollo/client';
import { Box, Button, Flex, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { MeDocument, MeQuery, RegisterInput } from '../__generated__/graphql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { registerMutation } from '../graphql-client/mutations/register';
import { mapFieldErrors } from '../helpers/mapFieldErrors';
import { useCheckAuth } from '../utils/useCheckAuth';

const Register = () => {
  const [registerUser, { error, loading: _loading }] = useMutation(registerMutation);
  const { data: authData, loading: authLoading } = useCheckAuth();
  const router = useRouter();
  const toast = useToast();

  const initialValues: RegisterInput = {
    username: '',
    email: '',
    password: '',
  };
  const onRegisterSubmit = async (
    values: RegisterInput,
    { setSubmitting, setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: { registerInput: values },
      update: (cache, { data }) => {
        if (data?.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.register.user },
          });
        }
      },
    });
    if (response.data?.register.errors) {
      setErrors(mapFieldErrors(response.data?.register.errors));
    } else if (response.data?.register.user) {
      toast({
        title: `Welcome ${response.data.register.user.username}!`,
        description: 'Registered successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    }
    setSubmitting(false);
  };
  return authLoading || (!authLoading && authData?.me) ? (
    <Flex justifyContent="center" alignItems="center" minH="100vh">
      <Spinner />
    </Flex>
  ) : (
    <Wrapper>
      {error && <p>Failed to register. Internal server error.</p>}
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" type="text" />
            <Box mt={4}>
              <InputField name="email" placeholder="Email" label="Email" type="text" />
            </Box>
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="Password" type="password" />
            </Box>
            <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
