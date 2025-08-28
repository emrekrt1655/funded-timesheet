import { customFetch, getApiPath, getId, type FetchResponse } from '@/lib/dataAccess';
import { type PagedCollection } from '@/types/collection';
import { PublicHoliday } from '@/types/PublicHoliday';

export type PublicHolidayCollection = PagedCollection<PublicHoliday>;

export type OrderDirection = 'asc' | 'desc';

export interface PublicHolidayListParams {
  page?: number;
  itemsPerPage?: number;
  groups?: string[];
  filters?: Array<[string, string]>;
  order?: { name: string; direction: OrderDirection };
  pagination?: boolean;
}

export async function fetchPublicHolidays(
  params: PublicHolidayListParams = {},
): Promise<FetchResponse<PublicHolidayCollection> | undefined> {
  const path = getApiPath({
    path: 'public_holidays',
    page: params.page,
    itemsPerPage: params.itemsPerPage,
    groups: params.groups,
    filters: params.filters,
    order: params.order,
    pagination: params.pagination,
  });

  return await customFetch<PublicHolidayCollection>(path);
}

export async function fetchPublicHoliday(
  idOrIri: string,
): Promise<FetchResponse<PublicHoliday> | undefined> {
  const id = getId(idOrIri);
  return await customFetch<PublicHoliday>(`/public_holidays/${id}`);
}
