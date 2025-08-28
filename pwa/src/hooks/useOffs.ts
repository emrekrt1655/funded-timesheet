'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOffs, fetchOff, type OffListParams } from '@/lib/services/offs';
import type { Off } from '@/types/Off';

const offsKeys = {
  all: ['offs'] as const,
  list: (params?: OffListParams) => ['offs', params ?? {}] as const,
  detail: (idOrIri: string) => ['off', idOrIri] as const,
};

export function useOffs(params?: OffListParams) {
  const { data, ...rest } = useQuery<{ member?: Off[] }, Error, Off[]>({
    queryKey: offsKeys.list(params),
    queryFn: async () => (await fetchOffs(params ?? {})).data,
    select: (d) => d?.member ?? [],
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
    queryKey: idOrIri ? offsKeys.detail(idOrIri) : offsKeys.detail(''),
    enabled: !!idOrIri,
    queryFn: async () => (await fetchOff(idOrIri!)).data,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    off: data,
    ...rest,
  };
}
