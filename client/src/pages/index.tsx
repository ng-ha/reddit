import { useQuery } from '@apollo/client';
import { PostsDocument } from '../__generated__/graphql';
import Navbar from '../components/Navbar';
import { postsQuery } from '../graphql-client/queries/posts';
import { addApolloState, initializeApollo } from '../lib/apolloClient';

const Index = () => {
  const { data, loading } = useQuery(postsQuery);
  return (
    <>
      <Navbar />
      {loading ? (
        'LOADING ....'
      ) : (
        <ul>
          {data?.posts?.map((post) => (
            <li>{post.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostsDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};
