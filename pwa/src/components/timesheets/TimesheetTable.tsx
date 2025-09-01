'use client';

import Link from 'next/link';
import type { Year } from '@/types/Year';
import { getId } from '@/lib/dataAccess';
import { useDeleteYear } from '@/hooks/useYears';
import { useState } from 'react';

export default function TimesheetTable({ years }: { years: Year[] }) {
  const { mutate: deleteYear, isPending, error } = useDeleteYear();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!years || years.length === 0) return null;

  const handleDelete = (idOrIri: string, yearLabel?: number | string) => {
    const id = getId(idOrIri);
    if (!id) return;

    const ok = window.confirm(
      `Are you sure you want to delete the timesheet${yearLabel ? ` for ${yearLabel}` : ''}? This cannot be undone.`
    );
    if (!ok) return;

    setDeletingId(id);
    deleteYear(idOrIri, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-600">
              Year
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-600">
              Region
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-right font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {years.map((y) => {
            const iri = y['@id'] ?? '';
            const id = getId(iri);
            const rowKey = iri || id;
            const isThisDeleting = isPending && deletingId === id;

            return (
              <tr key={rowKey} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link
                    href={`/timesheets/${id}`}
                    className="text-blue-600 hover:underline"
                    aria-label={`Open timesheet ${y.year}`}
                  >
                    {y.year ?? '—'}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {y.region?.value ?? '—'}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Link
                    href={`/timesheets/${id}`}
                    className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(iri || id, y.year)}
                    disabled={isThisDeleting}
                    className={`inline-flex items-center rounded-md border px-3 py-1 text-xs ${
                      isThisDeleting
                        ? 'cursor-not-allowed opacity-60 border-gray-200'
                        : 'hover:bg-red-50 border-red-200'
                    } text-red-600`}
                    aria-label={`Delete timesheet ${y.year}`}
                  >
                    {isThisDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {error && (
        <div className="m-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {(error as Error)?.message || 'Failed to delete the timesheet.'}
        </div>
      )}
    </div>
  );
}
