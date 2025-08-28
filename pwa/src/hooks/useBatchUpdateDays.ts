'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDay } from '@/lib/services/days';
import type { Day } from '@/types/Day';

const dayKeys = {
  detail: (yearId: string) => ['year', yearId] as const,
};

export type BatchUpdateItem = {
  idOrIri: string;
  payload: Record<string, any>;
};

export type BatchUpdateDaysInput = {
  items: BatchUpdateItem[];
  invalidateYearId?: string;
};

function iriTail(iri: string) {
  try {
    return iri.split('/').slice(-1)[0] ?? iri;
  } catch {
    return iri;
  }
}

export function useBatchUpdateDays() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ items }: BatchUpdateDaysInput) => {
      const results = await Promise.allSettled(
        items.map(({ idOrIri, payload }) => updateDay(idOrIri, payload)),
      );
      return results;
    },

    onMutate: async (vars) => {
      if (!vars.invalidateYearId) return {};

      const yearKey = dayKeys.detail(vars.invalidateYearId);
      await qc.cancelQueries({ queryKey: yearKey });

      const previous = qc.getQueryData(yearKey);

      qc.setQueryData<any>(yearKey, (old: any) => {
        if (!old?.data?.days) return old;
        const mapById = new Map(
          vars.items.map(
            ({ idOrIri, payload }) => [iriTail(idOrIri), payload] as const,
          ),
        );
        const nextDays: Day[] = old.data.days.map((d: Day) => {
          const id = iriTail(d['@id'] ?? '');
          if (id && mapById.has(id)) {
            return { ...d, ...(mapById.get(id) as Record<string, any>) } as Day;
          }
          if (d['@id'] && mapById.has(d['@id'] as string)) {
            return {
              ...d,
              ...(mapById.get(d['@id'] as string) as Record<string, any>),
            } as Day;
          }
          return d;
        });
        return { ...old, data: { ...old.data, days: nextDays } };
      });

      return { previous, yearKey };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx && (ctx as any).previous && (ctx as any).yearKey) {
        const { previous, yearKey } = ctx as {
          previous: any;
          yearKey: readonly [string, string];
        };
        qc.setQueryData(yearKey, previous);
      }
    },

    onSettled: async (_data, _err, vars, ctx) => {
      if (vars.invalidateYearId) {
        const yearKey =
          (ctx as any)?.yearKey ?? dayKeys.detail(vars.invalidateYearId);
        await qc.invalidateQueries({ queryKey: yearKey });
      }
      await qc.invalidateQueries({ queryKey: ['years'] });
    },
  });
}
