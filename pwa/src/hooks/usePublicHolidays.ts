'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicHolidays,
  fetchPublicHoliday,
  type PublicHolidayListParams,
} from '@/lib/services/publicHolidays';
import { PublicHoliday } from '@/types/PublicHoliday';

export function usePublicHolidays(params?: PublicHolidayListParams) {
  const { data, ...rest } = useQuery<PublicHoliday[]>({
    queryKey: ['public_holidays', params ?? {}],
    queryFn: async () => {
      const resp = await fetchPublicHolidays(params ?? {});
      return resp?.data.member ?? [];
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    publicHolidays: data ?? [],
    ...rest,
  };
}

export function usePublicHoliday(idOrIri?: string) {
  const { data, ...rest } = useQuery<PublicHoliday>({
    queryKey: ['public_holiday', idOrIri],
    enabled: !!idOrIri,
    queryFn: async () => {
      const resp = await fetchPublicHoliday(idOrIri!);
      if (!resp) throw new Error('Public holiday not found');
      return resp.data;
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    publicHoliday: data,
    ...rest,
  };
}
