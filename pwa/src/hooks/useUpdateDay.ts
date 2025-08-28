'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDay } from '@/lib/services/days';
import type { Year } from '@/types/Year';
import type { Day } from '@/types/Day';

export type UpdateDayInput = {
  idOrIri: string;
  payload: Record<string, any>;
  invalidateYearId?: string;
};

export function useUpdateDay() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ idOrIri, payload }: UpdateDayInput) =>
      await updateDay(idOrIri, payload),

    onMutate: async (vars) => {
      if (!vars.invalidateYearId) return {};

      const yearKey = ['year', vars.invalidateYearId] as const;

      await qc.cancelQueries({ queryKey: yearKey });

      const previousYear = qc.getQueryData<Year>(yearKey);

      if (previousYear && Array.isArray(previousYear.days)) {
        const updatedDays: Day[] = previousYear.days.map((d) => {
          const dayId = d['@id'] ?? '';
          const targetId =
            typeof vars.idOrIri === 'string'
              ? vars.idOrIri.split('/').slice(-1)[0]
              : '';
          const thisId =
            typeof dayId === 'string' ? dayId.split('/').slice(-1)[0] : '';
          if (thisId && targetId && thisId === targetId) {
            return { ...d, ...vars.payload } as Day;
          }
          return d;
        });

        qc.setQueryData<Year>(yearKey, { ...previousYear, days: updatedDays });
      }

      return { previousYear, yearKey };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx && (ctx as any).previousYear) {
        const { previousYear, yearKey } = ctx as {
          previousYear: Year;
          yearKey: readonly [string, string];
        };
        qc.setQueryData(yearKey, previousYear);
      }
    },

    onSettled: async (_resp, _err, vars, ctx) => {
      if (vars.invalidateYearId) {
        const yearKey =
          (ctx as any)?.yearKey ?? (['year', vars.invalidateYearId] as const);
        await qc.invalidateQueries({ queryKey: yearKey });
      }
      await qc.invalidateQueries({ queryKey: ['years'] });
    },
  });
}
