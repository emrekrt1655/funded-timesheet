'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicHolidays,
  fetchPublicHoliday,
  type PublicHolidayListParams,
} from '@/lib/services/publicHolidays';
import type { PublicHoliday } from '@/types/PublicHoliday';

const publicHolidayKeys = {
  all: ['public_holidays'] as const,
  list: (params?: PublicHolidayListParams) =>
    ['public_holidays', params ?? {}] as const,
  detail: (idOrIri: string) => ['public_holiday', idOrIri] as const,
};

export function usePublicHolidays(params?: PublicHolidayListParams) {
  const { data, ...rest } = useQuery<
    { member?: PublicHoliday[] },
    Error,
    PublicHoliday[]
  >({
    queryKey: publicHolidayKeys.list(params),
    queryFn: async () => (await fetchPublicHolidays(params ?? {}))!.data,
    select: (d) => d?.member ?? [],
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
    queryKey: idOrIri
      ? publicHolidayKeys.detail(idOrIri)
      : publicHolidayKeys.detail(''),
    enabled: !!idOrIri,
    queryFn: async () => (await fetchPublicHoliday(idOrIri!))!.data,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    publicHoliday: data,
    ...rest,
  };
}
