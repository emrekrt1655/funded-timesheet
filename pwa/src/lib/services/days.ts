import {
  customFetch,
  getId,
  type FetchResponse,
} from '@/lib/dataAccess';
import { Day } from '@/types/Day';

export async function updateDay(
  idOrIri: string,
  payload: Record<string, any>,
): Promise<FetchResponse<Day> | undefined> {
  const id = getId(idOrIri);
  return await customFetch<Day>(`/days/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
