'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchYears, createYear } from '@/lib/services/years';
import { Year } from '@/types/Year';

export function useYears() {
  const { data, ...rest } = useQuery<{ member?: Year[] }>({
    queryKey: ['years'],
    queryFn: async () => (await fetchYears()).data,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    years: data?.member ?? [],
    ...rest,
  };
}

type CreateYearInput = { year: number; region: string };
export function useCreateYear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateYearInput) => createYear(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['years'] });
    },
  });
}
