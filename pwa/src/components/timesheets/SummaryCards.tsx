'use client';

import { ReactNode } from 'react';

export type SummaryTotals = {
  totalHours: number;
  vacationDays: number;
  sickDays: number;
  publicHolidays: number;
  weekends: number;
};

type CardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

function StatCard({ label, value, hint }: CardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

export default function SummaryCards({ totals }: { totals: SummaryTotals }) {
  const { totalHours, vacationDays, sickDays, publicHolidays, weekends } =
    totals;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Total Hours" value={totalHours ?? 0} />
      <StatCard label="Vacation" value={vacationDays ?? 0} hint="Urlaub" />
      <StatCard label="Sick" value={sickDays ?? 0} hint="Krank" />
      <StatCard label="Public Holidays" value={publicHolidays ?? 0} />
      <StatCard label="Weekends" value={weekends ?? 0} />
    </div>
  );
}
