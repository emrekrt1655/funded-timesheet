'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRegions } from '@/lib/services/regions';
import { Region } from '@/types/Region';

export function useRegions() {
  const { data, ...rest } = useQuery<{ member?: Region[] }>({
    queryKey: ['regions'],
    queryFn: async () => (await fetchRegions()).data,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    regions: data?.member ?? [],
    ...rest,
  };
}
