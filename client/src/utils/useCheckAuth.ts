import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { meQuery } from '../graphql-client/queries/me';

export const useCheckAuth = () => {
  const router = useRouter();
  console.log('router.route ', router.route);
  console.log('router.pathname ', router.pathname);
  const { data, loading } = useQuery(meQuery);
  useEffect(() => {
    if (!loading && data?.me && (router.route === '/login' || router.route === '/register')) {
      router.replace('/');
    }
  }, [data, loading, router]);
  return { data, loading };
};
