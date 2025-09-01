// features/timesheets/hooks/useCommonDefaults.ts
'use client';

import { useMemo } from 'react';
import type { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

export type DayEditFormDefaults = {
  hours: string | '';
  off: OffValues | '';
  finish: string | '';
  publicHoliday: string | '';
};

function toISODateOnly(d?: string | Date | null) {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    .toISOString()
    .slice(0, 10);
}

// Returns the shared value for a picked field across all days; '' if none.
function common<T>(days: Day[], pick: (d: Day) => T | undefined): T | '' {
  if (!days.length) return '' as any;
  const vals = days.map(pick);
  const first = vals[0];
  return vals.every((v) => v === first && v != null)
    ? (first as unknown as T)
    : ('' as any);
}

export function useCommonDefaults(selectedDays: Day[]): DayEditFormDefaults {
  return useMemo(() => {
    return {
      hours:
        (common(selectedDays, (d) =>
          typeof d.hours === 'number' ? String(d.hours) : undefined,
        ) as string) || '',
      off: (common(selectedDays, (d) => d.off?.value) as OffValues) || '',
      finish:
        (common(selectedDays, (d) =>
          d.finish ? toISODateOnly(d.finish) : undefined,
        ) as string) || '',
      publicHoliday:
        (common(
          selectedDays,
          (d) => (d as any)?.publicHoliday?.['@id'] as string | undefined,
        ) as string) || '',
    };
  }, [selectedDays]);
}
