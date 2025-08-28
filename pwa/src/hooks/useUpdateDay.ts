'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDay } from '@/lib/services/days';

type UpdateDayInput = {
  idOrIri: string;
  payload: Record<string, any>;
  invalidateYearId?: string;
};

export function useUpdateDay() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ idOrIri, payload }: UpdateDayInput) =>
      await updateDay(idOrIri, payload),
    onSuccess: (_resp, vars) => {
      if (vars.invalidateYearId) {
        qc.invalidateQueries({ queryKey: ['year', vars.invalidateYearId] });
      }
    },
  });
}
