import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Form, Formik, FormikHelpers } from 'formik';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { meQuery } from '../../../graphql-client/queries/me';
import { postQuery } from '../../../graphql-client/queries/post';
import { updatePostMutation } from '../../../graphql-client/mutations/updatePost';
import { UpdatePostInput } from '../../../__generated__/graphql';

const PostEdit = () => {
  const router = useRouter();
  const { data: meData, loading: meLoading, error: meError } = useQuery(meQuery);
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery(postQuery, {
    variables: { id: router.query.id as string },
  });
  const [updatePost] = useMutation(updatePostMutation);
  const toast = useToast();

  if (meLoading || postLoading)
    return (
      <Layout>
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      </Layout>
    );
  if (meError || postError)
    return (
      <Layout>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>{meError ? meError.message : postError!.message}</AlertTitle>
        </Alert>
        <Flex>
          <Box mt={4} ml="auto">
            <NextLink href="/">
              <Button>Back to Homepage</Button>
            </NextLink>
          </Box>
        </Flex>
      </Layout>
    );

  if (!postData?.post)
    return (
      <Layout>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>Post not found!</AlertTitle>
        </Alert>
        <Flex>
          <Box mt={4} ml="auto">
            <NextLink href="/">
              <Button>Back to Homepage</Button>
            </NextLink>
          </Box>
        </Flex>
      </Layout>
    );

  if (!meData?.me || meData?.me?.id !== postData?.post?.userId.toString())
    return (
      <Layout>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <AlertTitle>You're not authorized to perfome this action!</AlertTitle>
        </Alert>
        <Flex>
          <Box mt={4} ml="auto">
            <NextLink href="/">
              <Button>Back to Homepage</Button>
            </NextLink>
          </Box>
        </Flex>
      </Layout>
    );

  const initialValues: Omit<UpdatePostInput, 'id'> = {
    title: postData.post.title,
    text: postData.post.text,
  };
  const postId = router.query.id as string;

  const onUpdatePostSubmit = async (
    values: Omit<UpdatePostInput, 'id'>,
    { setSubmitting }: FormikHelpers<Omit<UpdatePostInput, 'id'>>
  ) => {
    const response = await updatePost({
      variables: { updatePostInput: { id: postId, ...values } },
    });

    if (response.data?.updatePost.success) {
      toast({
        title: `Post updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setSubmitting(false);
    router.back();
  };
  return (
    <Layout>
      <Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" type="text" />
            <Box mt={4}>
              <InputField textarea name="text" placeholder="Text" label="Text" type="textarea" />
            </Box>
            <Flex justifyContent="space-between" alignItems="center" mt={4}>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Update Post
              </Button>
              <NextLink href="/" legacyBehavior>
                <Button>Go back to Homepage</Button>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default PostEdit;
