'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegions } from '@/hooks/useRegions';
import { useCreateYear } from '@/hooks/useYears';
import { getId } from '@/lib/dataAccess';
import TimesheetForm, {
  type TimesheetFormValues,
} from '@/components/timesheets/TimesheetForm';

export default function NewTimesheetPage() {
  const router = useRouter();
  const {
    regions,
    isLoading: regionsLoading,
    isError: regionsError,
  } = useRegions();
  const createYear = useCreateYear();

  const handleSubmit = async (values: TimesheetFormValues) => {
    const resp = await createYear.mutateAsync({
      year: values.year,
      region: values.region,
    });
    const iri = resp.data['@id'] ?? '';
    const id = getId(iri);
    router.push(`/timesheets/${id}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Create Timesheet
        </h1>
        <Link
          href="/timesheets"
          className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          Back to list
        </Link>
      </div>

      {regionsError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Failed to load regions.
        </div>
      )}

      <TimesheetForm
        regions={regions as any}
        regionsLoading={regionsLoading}
        submitLabel="Create"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
