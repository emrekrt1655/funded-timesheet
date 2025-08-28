'use client';

import { useMemo } from 'react';
import type { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

type Props = {
  days: Day[];
  month: number;
  year?: number;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onEditDay?: (day: Day) => void;
};

function getDayKey(d: Day) {
  return d['@id'] ?? String(d.date ?? '');
}

function getCellClasses(d: Day) {
  const classes = ['rounded-lg', 'p-3', 'border', 'border-gray-200'];

  const isWeekend = (() => {
    if (!d.date) return false;
    const dt = new Date(d.date);
    const wd = dt.getUTCDay();
    return wd === 0 || wd === 6;
  })();

  if (isWeekend) classes.push('bg-blue-50');
  if (d.publicHoliday) classes.push('bg-green-50');
  if (d.off?.value === OffValues.vacation) classes.push('bg-red-50');
  if (d.off?.value === OffValues.sick) classes.push('bg-yellow-50');

  return classes.join(' ');
}

function formatDateLabel(d: Day) {
  if (!d.date) return '—';
  const dt = new Date(d.date);
  return dt.getUTCDate();
}

export default function DaysGrid({
  days,
  month,
  year,
  selectable = true,
  selectedIds,
  onToggleSelect,
  onEditDay,
}: Props) {
  const sorted = useMemo(() => {
    return [...(days ?? [])].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return da - db;
    });
  }, [days]);

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        Days in <span className="font-medium">{month + 1}</span>
        {year ? <span> / {year}</span> : null}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
          <div
            key={w}
            className="px-1 py-1 text-center text-xs font-medium text-gray-500"
          >
            {w}
          </div>
        ))}

        {sorted.map((d) => {
          const key = getDayKey(d);
          const isSelected = selectedIds?.has(key);
          const date = d.date ? new Date(d.date) : undefined;
          const weekday = date ? date.getUTCDay() || 7 : 1;

          return (
            <div key={key} className="contents">
              {date && date.getUTCDate() === 1 && weekday > 1
                ? Array.from({ length: weekday - 1 }).map((_, i) => (
                    <div key={`sp_${i}`} />
                  ))
                : null}

              <div
                className={[
                  getCellClasses(d),
                  'relative',
                  selectable ? 'cursor-pointer' : '',
                  isSelected ? 'ring-2 ring-blue-500' : '',
                ].join(' ')}
                onClick={() => {
                  const id = key;
                  if (selectable && onToggleSelect && id) onToggleSelect(id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-gray-800">
                    {formatDateLabel(d)}
                  </div>
                  {onEditDay && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDay?.(d);
                      }}
                      className="rounded-md border border-gray-200 px-2 py-0.5 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="mt-2 space-y-1 text-xs text-gray-700">
                  {d.publicHoliday && (
                    <div className="font-medium">Public holiday</div>
                  )}
                  {d.off?.value && (
                    <div>
                      Off: <span className="font-medium">{d.off.value}</span>
                    </div>
                  )}
                  {typeof d.hours === 'number' && (
                    <div>
                      Hours: <span className="font-medium">{d.hours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-50 ring-1 ring-blue-200" />
          Weekend
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-50 ring-1 ring-green-200" />
          Public Holiday
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-50 ring-1 ring-red-200" />
          Vacation
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-yellow-50 ring-1 ring-yellow-200" />
          Sick
        </span>
      </div>
    </div>
  );
}
