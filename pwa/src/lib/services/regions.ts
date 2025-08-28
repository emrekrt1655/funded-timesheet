import {
  customFetch,
  getApiPath,
  getId,
  type FetchResponse,
} from '@/lib/dataAccess';
import { type PagedCollection } from '@/types/collection';
import { Region } from '@/types/Region';
import { ServerError } from '@/types/error';

export type RegionCollection = PagedCollection<Region>;
export type OrderDirection = 'asc' | 'desc';

export interface RegionListParams {
  page?: number;
  itemsPerPage?: number;
  groups?: string[];
  filters?: Array<[string, string]>;
  order?: { name: string; direction: OrderDirection };
  pagination?: boolean;
}

export async function fetchRegions(
  params: RegionListParams = {},
): Promise<FetchResponse<RegionCollection>> {
  const path = getApiPath({
    path: 'regions',
    page: params.page,
    itemsPerPage: params.itemsPerPage,
    groups: params.groups,
    filters: params.filters,
    order: params.order,
    pagination: params.pagination,
  });

  const resp = await customFetch<RegionCollection>(path);
  if (!resp) throw new ServerError();
  return resp;
}
export async function fetchRegion(
  idOrIri: string,
): Promise<FetchResponse<Region>> {
  const id = getId(idOrIri);
  const resp = await customFetch<Region>(`/regions/${id}`);
  if (!resp) throw new ServerError();
  return resp;
}
