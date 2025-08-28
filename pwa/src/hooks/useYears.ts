'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchYears,
  fetchYear,
  createYear,
  updateYear,
  deleteYear,
} from '@/lib/services/years';
import type { Year } from '@/types/Year';

const yearsKeys = {
  all: ['years'] as const,
  list: ['years', 'list'] as const,
  detail: (id: string) => ['year', id] as const,
};

export function useYears() {
  const { data, ...rest } = useQuery<{ member?: Year[] }, Error, Year[]>({
    queryKey: yearsKeys.list,
    queryFn: async () => (await fetchYears()).data,
    select: (d) => d?.member ?? [],
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    years: data ?? [],
    ...rest,
  };
}

export function useYear(idOrIri?: string) {
  const { data, ...rest } = useQuery<Year>({
    queryKey: idOrIri ? yearsKeys.detail(idOrIri) : yearsKeys.detail(''),
    enabled: !!idOrIri,
    queryFn: async () => (await fetchYear(idOrIri!)).data,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    year: data,
    ...rest,
  };
}

export function useCreateYear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { year: number; region: string }) =>
      createYear(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: yearsKeys.all });
    },
  });
}

export function useUpdateYear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { idOrIri: string; payload: Record<string, any> }) =>
      updateYear(vars.idOrIri, vars.payload),
    onSuccess: async (_resp, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: yearsKeys.all }),
        qc.invalidateQueries({ queryKey: yearsKeys.detail(vars.idOrIri) }),
      ]);
    },
  });
}

export function useDeleteYear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idOrIri: string) => deleteYear(idOrIri),
    onSuccess: async (_data, idOrIri) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: yearsKeys.all }),
        qc.removeQueries({ queryKey: yearsKeys.detail(idOrIri) }),
      ]);
    },
  });
}
