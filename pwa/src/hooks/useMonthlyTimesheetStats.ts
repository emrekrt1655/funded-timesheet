'use client';

import { useMemo } from 'react';
import type { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

export type MonthlyStats = {
  hours: number;
  sick: number;
  vacation: number;
};

export function useMonthlyTimesheetStats(
  days?: Day[],
  month?: number,
  year?: number,
): MonthlyStats {
  return useMemo(() => {
    if (!days || month == null || year == null) {
      return { hours: 0, sick: 0, vacation: 0 };
    }

    let hours = 0;
    let sick = 0;
    let vacation = 0;

    for (const d of days) {
      if (!d?.date) continue;
      const dt = new Date(d.date);
      if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month) continue;

      if (typeof d.hours === 'number') hours += d.hours;
      if (d.off?.value === OffValues.sick) sick += 1;
      if (d.off?.value === OffValues.vacation) vacation += 1;
    }

    return { hours, sick, vacation };
  }, [days, month, year]);
}
