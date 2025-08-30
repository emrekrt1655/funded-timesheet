'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useYear } from '@/hooks/useYears';
import SummaryCards from '@/components/timesheets/SummaryCards';
import MonthSwitcher from '@/components/timesheets/MonthSwitcher';
import DaysGrid from '@/components/timesheets/DaysGrid';
import { useTimesheetSummary } from '@/hooks/useTimesheetSummary';
import DayEditModal from '@/components/timesheets/DayEditModal';
import type { Day } from '@/types/Day';
import { usePublicHolidays } from '@/hooks/usePublicHolidays';

export default function TimesheetDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const [editDay, setEditDay] = useState<Day | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const yearId = Array.isArray(params?.id) ? (params.id[0] as string) : (params?.id as string);

  const { year, isLoading, isError, error, refetch } = useYear(yearId);
  const {publicHolidays} = usePublicHolidays()
  const totals = useTimesheetSummary(year?.days);

  const [month, setMonth] = useState<number>(new Date().getUTCMonth());
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

  const toDate = (x: unknown) =>
    typeof x === 'string' ? new Date(x) : x instanceof Date ? x : new Date(String(x));

  const daysOfMonth = useMemo<Day[]>(() => {
    if (!year?.days || month == null || !year?.year) return [];
    return [...year.days]
      .filter((d) => {
        const dt = toDate(d.date);
        return dt.getUTCFullYear() === year.year && dt.getUTCMonth() === month;
      })
      .sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());
  }, [year?.days, year?.year, month]);

  const handleEditDay = (day: Day) => {
    setEditDay(day);
    setModalOpen(true);
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
            publicHolidays={publicHolidays}
          />
        </div>
      )}

      <DayEditModal
      publicHolidays={publicHolidays}
        open={modalOpen}
        day={editDay}
        yearId={yearId}
        onClose={() => {
          setModalOpen(false);
          setEditDay(undefined);
        }}
      />
    </div>
  );
}
