import { useMutation, useQuery } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';

import { PostWithUserInfoFragment, VoteType } from '../__generated__/graphql';
import { voteMutation } from '../graphql-client/mutations/vote';
import { meQuery } from '../graphql-client/queries/me';

interface Props {
  post: PostWithUserInfoFragment;
}

enum VoteTypeValue {
  Upvote = 1,
  Downvote = -1,
}
const UpvoteSection = ({ post }: Props) => {
  const { data: meData } = useQuery(meQuery);
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
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="upvote"
        onClick={post.voteType === VoteTypeValue.Upvote ? undefined : upvote.bind(this, post.id)}
        isLoading={loading && loadingState === 'upvote-loading'}
        colorScheme={post.voteType === VoteTypeValue.Upvote ? 'green' : undefined}
        // isDisabled={!meData?.me}
      />
      {post.points}
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label="downvote"
        onClick={
          post.voteType === VoteTypeValue.Downvote ? undefined : downvote.bind(this, post.id)
        }
        isLoading={loading && loadingState === 'downvote-loading'}
        colorScheme={post.voteType === VoteTypeValue.Downvote ? 'red' : undefined}
        // isDisabled={!meData?.me}
      />
    </Flex>
  );
};

export default UpvoteSection;
