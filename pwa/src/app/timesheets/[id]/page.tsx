'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useYear } from '@/hooks/useYears';
import SummaryCards from '@/components/timesheets/SummaryCards';
import MonthSwitcher from '@/components/timesheets/MonthSwitcher';
import DaysGrid from '@/components/timesheets/DaysGrid';
import { useTimesheetSummary } from '@/hooks/useTimesheetSummary';
import { useMonthDays } from '@/hooks/useMonthDays';

export default function TimesheetDetailPage() {
  const params = useParams();
  const yearId = Array.isArray(params?.id)
    ? params?.id[0]
    : (params?.id as string);

  const { year, isLoading, isError, error, refetch } = useYear(yearId);
  const totals = useTimesheetSummary(year?.days);

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const handlePrev = () => setMonth((m) => Math.max(0, m - 1));
  const handleNext = () => setMonth((m) => Math.min(11, m + 1));

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const daysOfMonth = useMonthDays(year?.year, month, year?.days);

  const handleEditDay = (day: any) => {
    // TODO: open modal and update time
    alert(`Edit day ${day?.date ?? ''}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Timesheet {year?.year ?? ''}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Region: {year?.region?.value ?? '—'}
          </p>
        </div>
        <Link
          href="/timesheets"
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          Back to list
        </Link>
      </div>

      {isLoading && <div className="text-sm text-gray-500">Loading…</div>}

      {isError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {(error as Error)?.message || 'Something went wrong.'}
          <button
            onClick={() => refetch()}
            className="ml-3 inline-flex rounded-md border border-red-300 px-2 py-1 text-xs hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-6">
          <SummaryCards totals={totals} />

          <MonthSwitcher
            month={month}
            year={year?.year}
            onPrev={handlePrev}
            onNext={handleNext}
            onChange={setMonth}
          />

          <DaysGrid
            days={daysOfMonth}
            month={month}
            year={year?.year}
            selectable
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onEditDay={handleEditDay}
          />
        </div>
      )}
    </div>
  );
}
