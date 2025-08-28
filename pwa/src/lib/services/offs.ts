import {
  customFetch,
  getApiPath,
  getId,
  type FetchResponse,
} from '@/lib/dataAccess';
import { type PagedCollection } from '@/types/collection';
import { Off } from '@/types/Off';
import { ServerError } from '@/types/error';

export type OffCollection = PagedCollection<Off>;
export type OrderDirection = 'asc' | 'desc';

export interface OffListParams {
  page?: number;
  itemsPerPage?: number;
  groups?: string[];
  filters?: Array<[string, string]>;
  order?: { name: string; direction: OrderDirection };
  pagination?: boolean;
}

export async function fetchOffs(
  params: OffListParams = {},
): Promise<FetchResponse<OffCollection>> {
  const path = getApiPath({
    path: 'offs',
    page: params.page,
    itemsPerPage: params.itemsPerPage,
    groups: params.groups,
    filters: params.filters,
    order: params.order,
    pagination: params.pagination,
  });
  const resp = await customFetch<OffCollection>(path);
  if (!resp) throw new ServerError();
  return resp;
}

export async function fetchOff(
  idOrIri: string,
): Promise<FetchResponse<Off>> {
  const id = getId(idOrIri);
  const resp = await customFetch<Off>(`/offs/${id}`);
  if (!resp) throw new ServerError();
  return resp;
}
