// hooks/useBulkUpdateDays.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDay } from '@/lib/services/days';
import type { Year } from '@/types/Year';
import type { Day } from '@/types/Day';

export type BulkUpdateDaysInput =
  | {
      idsOrIris: string[];
      payload: Record<string, any>;
      invalidateYearId?: string;
    }
  | {
      items: { idOrIri: string; payload: Record<string, any> }[];
      invalidateYearId?: string;
    };

export function useBulkUpdateDays() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: BulkUpdateDaysInput) => {
      if ('items' in vars) {
        const results = await Promise.allSettled(
          vars.items.map((it) => updateDay(it.idOrIri, it.payload))
        );
        return results;
      } else {
        const results = await Promise.allSettled(
          vars.idsOrIris.map((id) => updateDay(id, vars.payload))
        );
        return results;
      }
    },

    onMutate: async (vars) => {
      const invalidateYearId = 'invalidateYearId' in vars ? vars.invalidateYearId : undefined;
      if (!invalidateYearId) return {};

      const yearKey = ['year', invalidateYearId] as const;
      await qc.cancelQueries({ queryKey: yearKey });
      const previousYear = qc.getQueryData<Year>(yearKey);

      if (previousYear && Array.isArray(previousYear.days)) {
        let updatedDays: Day[] = previousYear.days;

        if ('items' in vars) {
          const map = new Map<string, Record<string, any>>();
          vars.items.forEach((it) => {
            const parts = (it.idOrIri ?? '').toString().split('/');
            const id = parts[parts.length - 1] || '';
            if (id) map.set(id, it.payload);
          });

          updatedDays = previousYear.days.map((d) => {
            const thisId =
              typeof d['@id'] === 'string' ? d['@id'].split('/').slice(-1)[0] : '';
            if (thisId && map.has(thisId)) {
              return { ...d, ...map.get(thisId)! } as Day;
            }
            return d;
          });
        } else {
          const targetIds = new Set(
            vars.idsOrIris.map((s) => {
              const parts = (s ?? '').toString().split('/');
              return parts[parts.length - 1] || '';
            })
          );

          updatedDays = previousYear.days.map((d) => {
            const thisId =
              typeof d['@id'] === 'string' ? d['@id'].split('/').slice(-1)[0] : '';
            if (thisId && targetIds.has(thisId)) {
              return { ...d, ...vars.payload } as Day;
            }
            return d;
          });
        }

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
      const invalidateYearId = 'invalidateYearId' in vars ? vars.invalidateYearId : undefined;
      if (invalidateYearId) {
        const yearKey =
          (ctx as any)?.yearKey ?? (['year', invalidateYearId] as const);
        await qc.invalidateQueries({ queryKey: yearKey });
      }
      await qc.invalidateQueries({ queryKey: ['years'] });
    },
  });
}
