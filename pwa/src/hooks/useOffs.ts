'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOffs, fetchOff, type OffListParams } from '@/lib/services/offs';
import { Off } from '@/types/Off';

export function useOffs(params?: OffListParams) {
  const { data, ...rest } = useQuery<Off[]>({
    queryKey: ['offs', params ?? {}],
    queryFn: async () => {
      const resp = await fetchOffs(params ?? {});
      return resp.data.member ?? [];
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    offs: data ?? [],
    ...rest,
  };
}
export function useOff(idOrIri?: string) {
  const { data, ...rest } = useQuery<Off>({
    queryKey: ['off', idOrIri],
    enabled: !!idOrIri,
    queryFn: async () => {
      const resp = await fetchOff(idOrIri!);
      return resp.data;
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    off: data,
    ...rest,
  };
}
