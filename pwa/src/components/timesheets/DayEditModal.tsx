'use client';

import { useEffect, useMemo, useId } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useUpdateDay } from '@/hooks/useUpdateDay';
import { useBulkUpdateDays } from '@/hooks/useBulkUpdateDays';
import { useCommonDefaults } from '@/hooks/useCommonDefaultValues';
import { OffValues } from '@/types/Off';
import type { Day } from '@/types/Day';
import {
  schema,
  type FormInput,
  type Parsed,
} from '@/features/timesheets/schema/dayEdit';

type PublicHolidayOption = { '@id': string; value: string };

type Props = {
  open: boolean;
  mode?: 'single' | 'bulk';
  day?: Day;
  days?: Day[];
  yearId?: string;
  onClose: () => void;
  publicHolidays?: PublicHolidayOption[];
  selectedIds?: string[];
};

export default function DayEditModal({
  open,
  mode = 'single',
  day,
  days = [],
  yearId,
  onClose,
  publicHolidays = [],
}: Props) {
  const updateDay = useUpdateDay();
  const bulkUpdate = useBulkUpdateDays();

  const selectedDays: Day[] = useMemo(() => {
    if (mode === 'single') return day ? [day] : [];
    return days ?? [];
  }, [mode, day, days]);

  const defaultValues = useCommonDefaults(selectedDays);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
  } = useForm<FormInput>({
    defaultValues,
    mode: 'onTouched',
  });

  const selectionKey = useMemo(
    () => selectedDays.map((d) => d['@id'] ?? String(d.date ?? '')).join('|'),
    [selectedDays],
  );

  const offWatch = watch('off');

  const submit: SubmitHandler<FormInput> = async (values) => {
    if (!selectedDays.length) return;

    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((iss) => {
        const field = (iss.path?.[0] ?? '') as keyof FormInput;
        if (field) setError(field, { type: 'zod', message: iss.message });
      });
      return;
    }

    const parsed: Parsed = result.data;

    const payload: Record<string, any> = {};
    if (parsed.off !== undefined) {
      payload.off = parsed.off
        ? `/offs/${parsed.off === OffValues.vacation ? 'VACATION' : 'SICK'}`
        : null;
    }
    if (parsed.hours !== undefined) payload.hours = parsed.hours ?? null;
    if (parsed.publicHoliday !== undefined)
      payload.publicHoliday = parsed.publicHoliday ?? null;
    if (parsed.finish !== undefined) {
      payload.finish = parsed.finish
        ? new Date(parsed.finish).toISOString()
        : null;
    }
    if (payload.off) delete payload.hours;

    if (mode === 'single') {
      const theDay = selectedDays[0];
      if (!theDay?.['@id']) return;

      const yearIri =
        (theDay as any)?.year && typeof (theDay as any).year === 'string'
          ? (theDay as any).year
          : ((theDay as any)?.year?.['@id'] ??
            (yearId ? `/years/${yearId}` : undefined));

      const dateIso = theDay?.date
        ? new Date(theDay.date).toISOString()
        : undefined;

      const mergedPayload = { ...payload, year: yearIri, date: dateIso };

      await updateDay.mutateAsync({
        idOrIri: theDay['@id'],
        payload: mergedPayload,
        invalidateYearId: yearId,
      });
    } else {
      const items = selectedDays
        .map((d) => {
          const id = d['@id'];
          if (typeof id !== 'string') return null;

          const yearIri =
            (d as any)?.year && typeof (d as any).year === 'string'
              ? (d as any).year
              : ((d as any)?.year?.['@id'] ??
                (yearId ? `/years/${yearId}` : undefined));

          const dateIso = d?.date ? new Date(d.date).toISOString() : undefined;

          const existingPH =
            (d as any)?.publicHoliday &&
            typeof (d as any).publicHoliday === 'string'
              ? (d as any).publicHoliday
              : ((d as any)?.publicHoliday?.['@id'] ?? null);

          const publicHolidayResolved =
            parsed.publicHoliday !== undefined
              ? (parsed.publicHoliday ?? null)
              : existingPH;

          const existingFinish = d.finish
            ? new Date(d.finish).toISOString()
            : null;
          const finishResolved =
            parsed.finish !== undefined
              ? parsed.finish
                ? new Date(parsed.finish).toISOString()
                : null
              : (existingFinish ?? dateIso ?? null);

          const base: Record<string, any> = { ...payload };
          if (base.off) delete base.hours;

          const perItemPayload = {
            ...base,
            year: yearIri,
            date: dateIso,
            publicHoliday: publicHolidayResolved,
            finish: finishResolved,
          };

          return { idOrIri: id, payload: perItemPayload };
        })
        .filter(Boolean) as { idOrIri: string; payload: Record<string, any> }[];

      await bulkUpdate.mutateAsync({
        items,
        invalidateYearId: yearId,
      });
    }

    onClose();
  };

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, selectionKey]);

  const uid = useId();
  const hoursId = `hours-${uid}`;
  const offId = `off-${uid}`;
  const publicHolidayId = `publicHoliday-${uid}`;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-2 text-lg font-semibold text-gray-800">
          {mode === 'single'
            ? `Edit Day ${
                selectedDays[0]?.date
                  ? new Date(selectedDays[0].date).toDateString()
                  : ''
              }`
            : `Edit ${selectedDays.length} selected day${
                selectedDays.length > 1 ? 's' : ''
              }`}
        </h2>

        {mode === 'bulk' && (
          <div className="mb-4 flex flex-wrap gap-1 text-xs text-gray-600">
            {selectedDays.slice(0, 10).map((d) => {
              const label = d.date
                ? new Date(d.date).toISOString().slice(0, 10)
                : '—';
              return (
                <span
                  key={d['@id'] ?? label}
                  className="rounded border border-gray-200 px-2 py-0.5"
                >
                  {label}
                </span>
              );
            })}
            {selectedDays.length > 10 && (
              <span className="rounded border border-gray-200 px-2 py-0.5">
                +{selectedDays.length - 10} more
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor={hoursId} className="mb-1 block text-sm font-medium">
              Hours{' '}
              {mode === 'bulk' && (
                <span className="text-gray-400">(applies to all)</span>
              )}
            </label>
            <input
              id={hoursId}
              type="number"
              step="1"
              {...register('hours')}
              disabled={!!offWatch}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-50"
            />
            {errors.hours && (
              <p className="mt-1 text-sm text-red-600">
                {String(errors.hours.message)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={offId} className="mb-1 block text-sm font-medium">
              Off{' '}
              {mode === 'bulk' && (
                <span className="text-gray-400">(applies to all)</span>
              )}
            </label>
            <select
              id={offId}
              {...register('off')}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="">—</option>
              {Object.values(OffValues).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.off && (
              <p className="mt-1 text-sm text-red-600">
                {String(errors.off.message)}
              </p>
            )}
          </div>

          {mode === 'single' && (
            <div>
              <label
                htmlFor={publicHolidayId}
                className="mb-1 block text-sm font-medium"
              >
                Public holiday (optional)
              </label>
              <select
                id={publicHolidayId}
                {...register('publicHoliday')}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="">—</option>
                {publicHolidays.map((h) => (
                  <option key={h['@id']} value={h['@id']}>
                    {h.value}
                  </option>
                ))}
              </select>
              {errors.publicHoliday && (
                <p className="mt-1 text-sm text-red-600">
                  {String(errors.publicHoliday.message)}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
