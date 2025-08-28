'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRegions } from '@/lib/services/regions';
import type { Region } from '@/types/Region';

const regionKeys = {
  all: ['regions'] as const,
  list: ['regions', 'list'] as const,
};

export function useRegions() {
  const { data, ...rest } = useQuery<{ member?: Region[] }, Error, Region[]>({
    queryKey: regionKeys.list,
    queryFn: async () => (await fetchRegions()).data,
    select: (d) => d?.member ?? [],
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    regions: data ?? [],
    ...rest,
  };
}
