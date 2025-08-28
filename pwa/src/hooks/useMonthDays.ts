'use client';

import { useMemo } from 'react';
import type { Day } from '@/types/Day';

const isoKey = (dt: Date | string) =>
  (typeof dt === 'string' ? new Date(dt) : dt).toISOString().slice(0, 10);

const buildSkeleton = (year: number, month0: number) => {
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(Date.UTC(year, month0, i + 1)),
  })) as Pick<Day, 'date'>[];
};

export function useMonthDays(
  yearNum?: number,
  month0?: number,
  apiDays?: Day[],
) {
  return useMemo<Day[]>(() => {
    if (yearNum == null || month0 == null) return [];

    const skeleton = buildSkeleton(yearNum, month0);
    const byDate = new Map<string, Day>();
    (apiDays ?? []).forEach((d) => {
      if (d.date) byDate.set(isoKey(d.date), d);
    });

    return skeleton.map(
      (s) => byDate.get(isoKey(s.date!)) ?? ({ date: s.date } as Day),
    );
  }, [yearNum, month0, apiDays]);
}
