import { useMutation } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ChangePasswordInput, MeDocument, MeQuery } from '../__generated__/graphql';
import InputField from '../components/InputField';
import Navbar from '../components/Navbar';
import Wrapper from '../components/Wrapper';
import { changePasswordMutation } from '../graphql-client/mutations/changePassword';
import { mapFieldErrors } from '../helpers/mapFieldErrors';
import { useCheckAuth } from '../utils/useCheckAuth';

const ChangePassword = () => {
  const [changePassword] = useMutation(changePasswordMutation);
  const router = useRouter();
  const [tokenError, setTokenError] = useState<string>('');
  const { data: authData, loading: authLoading } = useCheckAuth();
  const toast = useToast();

  const initialValues: ChangePasswordInput = { newPassword: '' };

  const onChangePasswordSubmit = async (
    values: ChangePasswordInput,
    { setSubmitting, setErrors }: FormikHelpers<ChangePasswordInput>
  ) => {
    if (router.query.userId && router.query.token) {
      const response = await changePassword({
        variables: {
          userId: router.query.userId as string,
          token: router.query.token as string,
          changePasswordInput: values,
        },
        update: (cache, { data }) => {
          if (data?.changePassword.success) {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: { me: data.changePassword.user },
            });
          }
        },
      });
      if (response.data?.changePassword.errors) {
        const fieldErrors = mapFieldErrors(response.data.changePassword.errors);
        if ('token' in fieldErrors) {
          setTokenError(fieldErrors.token);
        }
        setErrors(fieldErrors);
      } else if (response.data?.changePassword.user) {
        toast({
          title: `Welcome back ${response.data.changePassword.user.username}!`,
          description: 'Password changed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/');
      }
    }
    setSubmitting(false);
  };

  if (authLoading || (!authLoading && authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else if (!router.query.userId || !router.query.token) {
    return (
      <Wrapper size="small">
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>Invalid password change request!</AlertTitle>
        </Alert>
        <Flex mt={4}>
          <NextLink href="/login" legacyBehavior>
            <Link ml="auto">Back to login</Link>
          </NextLink>
        </Flex>
      </Wrapper>
    );
  } else {
    return (
      <>
        <Navbar />
        <Wrapper size="small">
          <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="newPassword"
                  placeholder="New password"
                  label="New password"
                  type="password"
                />
                {tokenError && (
                  <Flex>
                    <Box color="red" mr="2">
                      {tokenError}
                    </Box>
                    <NextLink href="/forgot-password" legacyBehavior>
                      <Link>Back</Link>
                    </NextLink>
                  </Flex>
                )}
                <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                  Change password
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </>
    );
  }
};

export default ChangePassword;
