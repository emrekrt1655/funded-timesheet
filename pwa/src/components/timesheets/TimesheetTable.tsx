'use client';

import Link from 'next/link';
import type { Year } from '@/types/Year';
import { getId } from '@/lib/dataAccess';

export default function TimesheetTable({ years }: { years: Year[] }) {
  if (!years || years.length === 0) return null;

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
            return (
              <tr key={iri || id} className="hover:bg-gray-50">
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
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/timesheets/${id}`}
                    className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
