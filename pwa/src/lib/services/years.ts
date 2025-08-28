import {
  customFetch,
  getApiPath,
  getId,
  type FetchResponse,
} from '@/lib/dataAccess';
import { type PagedCollection } from '@/types/collection';
import { Year } from '@/types/Year';
import { ServerError } from '@/types/error';

export type YearCollection = PagedCollection<Year>;
export type OrderDirection = 'asc' | 'desc';

export interface YearListParams {
  page?: number;
  itemsPerPage?: number;
  groups?: string[];
  filters?: Array<[string, string]>;
  order?: { name: string; direction: OrderDirection };
  pagination?: boolean;
}

export async function fetchYears(
  params: YearListParams = {},
): Promise<FetchResponse<YearCollection>> {
  const path = getApiPath({
    path: 'years',
    page: params.page,
    itemsPerPage: params.itemsPerPage,
    groups: params.groups,
    filters: params.filters,
    order: params.order,
    pagination: params.pagination,
  });
  const resp = await customFetch<YearCollection>(path);
  if (!resp) throw new ServerError();
  return resp;
}

export async function fetchYear(
  idOrIri: string,
): Promise<FetchResponse<Year>> {
  const id = getId(idOrIri);
  const resp = await customFetch<Year>(`/years/${id}`);
  if (!resp) throw new ServerError();
  return resp;
}

export async function createYear(
  payload: Record<string, any>,
): Promise<FetchResponse<Year>> {
  const resp = await customFetch<Year>('/years', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!resp) throw new ServerError();
  return resp;
}
export async function updateYear(
  idOrIri: string,
  payload: Record<string, any>,
): Promise<FetchResponse<Year> | undefined> {
  const id = getId(idOrIri);
  return await customFetch<Year>(`/years/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
export async function deleteYear(idOrIri: string): Promise<void> {
  const id = getId(idOrIri);
  await customFetch(`/years/${id}`, { method: 'DELETE' });
}
