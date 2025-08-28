'use client';

import { useMemo } from 'react';
import type { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';
import { legend } from '@/types/Year';

export interface TimesheetSummary {
  totalHours: number;
  vacationDays: number;
  sickDays: number;
  publicHolidays: number;
  weekends: number;
}

export function useTimesheetSummary(days?: Day[]): TimesheetSummary {
  return useMemo(() => {
    if (!days) {
      return {
        totalHours: 0,
        vacationDays: 0,
        sickDays: 0,
        publicHolidays: 0,
        weekends: 0,
      };
    }

    let totalHours = 0;
    let vacationDays = 0;
    let sickDays = 0;
    let publicHolidays = 0;
    let weekends = 0;

    for (const d of days) {
      if (typeof d.hours === 'number') totalHours += d.hours;
      if (d.off?.value === OffValues.vacation) vacationDays++;
      if (d.off?.value === OffValues.sick) sickDays++;
      if (d.publicHoliday) publicHolidays++;

      if (d.date) {
        const dateObj = new Date(d.date);
        const day = dateObj.getUTCDay();
        if (day === 0 || day === 6) weekends++;
      }
    }

    return { totalHours, vacationDays, sickDays, publicHolidays, weekends };
  }, [days]);
}
