'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  year: z.number().int('Year must be an integer').min(1970, 'Year must be ≥ 1970').max(2100, 'Year must be ≤ 2100'),
  region: z.string().min(1, 'Region is required'),
});

export type TimesheetFormValues = z.infer<typeof schema>;
export type RegionOption = { '@id': string; value: string };

type Props = {
  regions: RegionOption[];
  regionsLoading?: boolean;
  defaultYear?: number;
  defaultRegionId?: string;
  submitLabel?: string;
  onSubmit: (values: TimesheetFormValues) => Promise<void> | void;
};

export default function TimesheetForm({
  regions,
  regionsLoading,
  defaultYear = new Date().getFullYear(),
  defaultRegionId = '',
  submitLabel = 'Create',
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TimesheetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { year: defaultYear, region: defaultRegionId },
    mode: 'onTouched',
  });

  const submit: SubmitHandler<TimesheetFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-lg space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          min={1970}
          max={2100}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 2025"
          {...register('year', { valueAsNumber: true })}
        />
        {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Region</label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={regionsLoading}
          {...register('region')}
        >
          <option value="" disabled>
            {regionsLoading ? 'Loading regions…' : 'Select a region'}
          </option>
          {regions.map((r) => (
            <option key={r['@id']} value={r['@id']}>
              {r.value}
            </option>
          ))}
        </select>
        {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || regionsLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
