import { useMutation } from '@apollo/client';
import { Box, Button, Flex, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { CreatePostInput } from '../__generated__/graphql';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { createPostMutation } from '../graphql-client/mutations/createPost';
import { useCheckAuth } from '../utils/useCheckAuth';

const CreatePost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [createPost] = useMutation(createPostMutation);
  const router = useRouter();
  const toast = useToast();

  const initialValues: CreatePostInput = {
    text: '',
    title: '',
  };

  const onCreatePostSubmit = async (
    values: CreatePostInput,
    { setSubmitting }: FormikHelpers<CreatePostInput>
  ) => {
    const response = await createPost({
      variables: { createPostInput: values },
      // refetchQueries: [{ query: postsQuery, variables: { limit: 3 } }],
      // doesnt work: post13 post14 post15 + create post16 => post14 post15 post16 (post13 cached)
      update: (cache, { data }) => {
        cache.modify({
          //cache.modify overrides merge in field policy
          fields: {
            posts: (existing) => {
              console.log({ existing });
              if (data?.createPost.success && data.createPost.post) {
                const newPostRef = cache.identify(data.createPost.post); //Post:[new-id]
                console.log({ newPostRef });

                const newPostsAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedPosts: [
                    { __ref: newPostRef },
                    ...existing.paginatedPosts, //[{__ref: "Post:20"}, {__ref: "Post:21"}, {__ref: "Post:22"}]
                  ],
                };
                console.log({ newPostsAfterCreation });
                return newPostsAfterCreation;
              }
            },
          },
        });
      },
    });

    if (response.data?.createPost) {
      toast({
        title: `Post created successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    setSubmitting(false);
    router.push('/');
  };

  if (authLoading || (!authLoading && !authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else
    return (
      <Layout>
        <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="Title" label="Title" type="text" />
              <Box mt={4}>
                <InputField name="text" placeholder="Text" label="Text" type="text" textarea />
              </Box>
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                  Create Post
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

export default CreatePost;
