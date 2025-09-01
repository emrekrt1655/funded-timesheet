import { z } from 'zod';
import { OffValues } from '@/types/Off';

export const schema = z
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
    (val) =>
      !(val.off !== undefined && val.hours !== undefined && val.hours > 0),
    { path: ['hours'], message: 'You can not add hours while Off is selected' },
  );

export type FormInput = {
  hours: string | '';
  off: OffValues | '';
  finish: string | '';
  publicHoliday: string | '';
};

export type Parsed = z.output<typeof schema>;
