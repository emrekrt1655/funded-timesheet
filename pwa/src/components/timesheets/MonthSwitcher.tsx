'use client';

import { MONTHS } from '@/lib/constants';
import { useMemo } from 'react';

type Props = {
  month: number;
  year?: number;
  onPrev: () => void;
  onNext: () => void;
  onChange?: (m: number) => void;
};

export default function MonthSwitcher({
  month,
  year,
  onPrev,
  onNext,
  onChange,
}: Props) {
  const label = useMemo(
    () => `${MONTHS[month]}${year ? ` ${year}` : ''}`,
    [month, year],
  );

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onPrev}
          disabled={month <= 0}
          className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Prev
        </button>
        <select
          value={month}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select month"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>
        <button
          onClick={onNext}
          disabled={month >= 11}
          className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </div>
  );
}
