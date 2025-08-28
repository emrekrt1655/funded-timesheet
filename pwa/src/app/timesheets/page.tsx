'use client';

import Link from 'next/link';
import { useYears } from '@/hooks/useYears';
import TimesheetTable from '@/components/timesheets/TimesheetTable';

export default function TimesheetsPage() {
  const { years, isLoading, isError, error, refetch } = useYears();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Timesheets</h1>
        <Link
          href="/timesheets/new"
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Timesheet
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

      {!isLoading && !isError && years.length === 0 && (
        <div className="rounded-md border border-gray-200 p-4 text-sm text-gray-600">
          No timesheets yet. Create your first one.
        </div>
      )}

      {!isLoading && !isError && years.length > 0 && (
        <TimesheetTable years={years} />
      )}
    </div>
  );
}
