import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { meQuery } from '../graphql-client/queries/me';

export const useCheckAuth = () => {
  const router = useRouter();
  const { data, loading } = useQuery(meQuery);
  useEffect(() => {
    if (!loading) {
      if (
        data?.me &&
        (router.route === '/login' ||
          router.route === '/register' ||
          router.route === '/forgot-password' ||
          router.route === '/change-password')
      ) {
        router.replace('/');
      } else if (
        !data?.me &&
        router.route !== '/login' &&
        router.route !== '/register' &&
        router.route !== '/forgot-password' &&
        router.route !== '/change-password'
      ) {
        router.replace('/login');
      }
    }
  }, [data, loading, router]);
  return { data, loading };
};
