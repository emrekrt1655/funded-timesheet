'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { OffValues } from '@/types/Off';
import { useUpdateDay } from '@/hooks/useUpdateDay';
import type { Day } from '@/types/Day';

const schema = z
  .object({
    hours: z
      .union([z.string(), z.literal('')])
      .transform((v) => (v === '' ? undefined : Number(v)))
      .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0))
      .optional(),
    off: z
      .union([z.nativeEnum(OffValues), z.literal('')])
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    finish: z
      .union([z.string().min(1), z.literal('')])
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    publicHoliday: z
      .union([z.string().min(1), z.literal('')])
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
  })
  .refine(
    (val) => !(val.off !== undefined && val.hours !== undefined && val.hours > 0),
    { path: ['hours'], message: 'Off seçiliyken saat girme' }
  );

type FormInput = {
  hours: string | '';
  off: OffValues | '';
  finish: string | '';
  publicHoliday: string | '';
};

type Parsed = z.output<typeof schema>;

type PublicHolidayOption = { '@id': string; value: string };

type Props = {
  open: boolean;
  day?: Day;
  yearId?: string;
  onClose: () => void;
  publicHolidays?: PublicHolidayOption[];
};

export default function DayEditModal({ open, day, yearId, onClose, publicHolidays = [] }: Props) {
  const updateDay = useUpdateDay();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormInput>({
    defaultValues: {
      hours: day?.hours != null ? String(day.hours) : '',
      off: day?.off?.value ?? '',
      finish: day?.finish ? new Date(day.finish).toISOString().slice(0, 10) : '',
      publicHoliday: (day as any)?.publicHoliday?.['@id'] ?? '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      hours: day?.hours != null ? String(day.hours) : '',
      off: day?.off?.value ?? '',
      finish: day?.finish ? new Date(day.finish).toISOString().slice(0, 10) : '',
      publicHoliday: (day as any)?.publicHoliday?.['@id'] ?? '',
    });
  }, [day, reset, open]);

  const submit: SubmitHandler<FormInput> = async (values) => {
    if (!day?.['@id']) return;

    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((iss) => {
        const field = (iss.path?.[0] ?? '') as keyof FormInput;
        if (field) setError(field, { type: 'zod', message: iss.message });
      });
      return;
    }

    const parsed: Parsed = result.data;

    const yearIri =
      (day as any)?.year && typeof (day as any).year === 'string'
        ? (day as any).year
        : (day as any)?.year?.['@id'] ?? (yearId ? `/years/${yearId}` : undefined);

    const dateIso = day?.date ? new Date(day.date).toISOString() : undefined;

    const publicHolidayIri =
      parsed.publicHoliday ??
      ((day as any)?.publicHoliday && typeof (day as any).publicHoliday === 'string'
        ? (day as any).publicHoliday
        : (day as any)?.publicHoliday?.['@id'] ?? null);

    const finishIso = parsed.finish ? new Date(parsed.finish).toISOString() : dateIso ?? null;

    const payload = {
      year: yearIri,
      date: dateIso,
      publicHoliday: publicHolidayIri,
      hours: parsed.off ? null : (parsed.hours ?? null),
      off: parsed.off ? `/offs/${parsed.off === OffValues.vacation ? 'VACATION' : 'SICK'}` : null,
      finish: finishIso,
    };

    await updateDay.mutateAsync({
      idOrIri: day['@id'],
      payload,
      invalidateYearId: yearId,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Edit Day {day?.date ? new Date(day.date).toDateString() : ''}
        </h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium">Hours</label>
            <input
              type="number"
              step="0.5"
              {...register('hours')}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            {errors.hours && <p className="mt-1 text-sm text-red-600">{String(errors.hours.message)}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Off</label>
            <select {...register('off')} className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
              <option value="">—</option>
              {Object.values(OffValues).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.off && <p className="mt-1 text-sm text-red-600">{String(errors.off.message)}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Public holiday (optional)</label>
            <select {...register('publicHoliday')} className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
              <option value="">—</option>
              {publicHolidays.map((h) => (
                <option key={h['@id']} value={h['@id']}>
                  {h.value}
                </option>
              ))}
            </select>
            {errors.publicHoliday && (
              <p className="mt-1 text-sm text-red-600">{String(errors.publicHoliday.message)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Finish (optional)</label>
            <input
              type="date"
              {...register('finish')}
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            {errors.finish && <p className="mt-1 text-sm text-red-600">{String(errors.finish.message)}</p>}
          </div>

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
