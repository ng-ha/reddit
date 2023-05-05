import { useMutation } from '@apollo/client';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';

import { PostWithUserInfoFragment, VoteType } from '../__generated__/graphql';
import { voteMutation } from '../graphql-client/mutations/vote';
import Dislike from './Dislike';
import Like from './Like';

interface Props {
  post: PostWithUserInfoFragment;
}

enum VoteTypeValue {
  Upvote = 1,
  Downvote = -1,
}
const UpvoteSection = ({ post }: Props) => {
  const [vote, { loading }] = useMutation(voteMutation);
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');

  const upvote = async (postId: string) => {
    setLoadingState('upvote-loading');
    await vote({ variables: { inputVoteValue: VoteType.Upvote, postId: parseInt(postId) } });
    setLoadingState('not-loading');
  };
  const downvote = async (postId: string) => {
    setLoadingState('downvote-loading');
    await vote({ variables: { inputVoteValue: VoteType.Downvote, postId: parseInt(postId) } });
    setLoadingState('not-loading');
  };
  return (
    <Flex direction="row" alignItems="center" mr={4}>
      <IconButton
        size="xs"
        mr={2}
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        icon={<Like colored={post.voteType === VoteTypeValue.Upvote} />}
        aria-label="upvote"
        onClick={post.voteType === VoteTypeValue.Upvote ? undefined : upvote.bind(this, post.id)}
        isLoading={loading && loadingState === 'upvote-loading'}
      />
      <IconButton
        size="xs"
        mr={2}
        icon={<Dislike colored={post.voteType === VoteTypeValue.Downvote} />}
        aria-label="downvote"
        onClick={
          post.voteType === VoteTypeValue.Downvote ? undefined : downvote.bind(this, post.id)
        }
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        isLoading={loading && loadingState === 'downvote-loading'}
      />

      <Box fontSize={12} fontWeight="bold">
        Votes: {post.points}
      </Box>
    </Flex>
  );
};

export default UpvoteSection;
