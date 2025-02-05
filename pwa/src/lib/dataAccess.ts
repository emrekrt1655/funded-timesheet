import { ENTRYPOINT } from '@/../config/entrypoint';
import {
  HEADER_CONTENT_TYPE,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
  METHOD_PATCH,
  MIME_TYPE_JSON_LD,
  MIME_TYPE_JSON_PATCH,
} from '@/lib/constants';
import { PagedCollection } from '@/types/collection';
import {
  ForbiddenError,
  HttpError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '@/types/error';
import { UnprocessableEntityError } from '@/types/error';
import { Item } from '@/types/item';

export interface Violation {
  title: string;
  message: string;
  propertyPath: string;
}

export interface FetchResponse<TData> {
  hubURL: string | null;
  data: TData;
  text: string;
}

const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) {
    return null;
  }

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/,
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
};

export const customFetch = async <TData>(
  id: string,
  init: RequestInit = {},
): Promise<FetchResponse<TData> | undefined> => {
  if (typeof init.headers === 'undefined') {
    init.headers = {};
  }
  if (!init.headers.hasOwnProperty('Accept')) {
    init.headers = { ...init.headers, Accept: MIME_TYPE_JSON_LD };
  }
  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !init.headers?.hasOwnProperty(HEADER_CONTENT_TYPE)
  ) {
    init.headers = {
      ...init.headers,
      [HEADER_CONTENT_TYPE]:
        init.method === METHOD_PATCH ? MIME_TYPE_JSON_PATCH : MIME_TYPE_JSON_LD,
    };
  }

  const resp = await fetch(ENTRYPOINT + id, init);

  if (resp.status === HTTP_STATUS_NO_CONTENT) {
    return;
  }

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    throw new ServerError();
  }

  const status = json['description'] || resp.statusText;

  if (resp.status === HTTP_STATUS_UNAUTHORIZED) {
    throw new UnauthorizedError(status);
  }

  if (resp.status === HTTP_STATUS_FORBIDDEN) {
    throw new ForbiddenError(status);
  }

  if (resp.status === HTTP_STATUS_NOT_FOUND) {
    throw new NotFoundError(status);
  }

  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString() || null, // URL cannot be serialized as JSON, must be sent as string
      data: json,
      text,
    };
  }

  if (!json.violations) {
    throw new HttpError(status, resp.status);
  }

  const fields: { field: string; message: string }[] = [];
  json.violations.forEach((violation: Violation) =>
    fields.push({
      field: violation.propertyPath,
      message: violation.message ?? violation.title,
    }),
  );

  throw new UnprocessableEntityError(status, fields);
};

export const getItemPath = (
  iri: string | undefined,
  pathTemplate: string,
): string => {
  if (!iri) {
    return '';
  }

  const resourceId = iri.split('/').slice(-1)[0];

  return pathTemplate.replace('[id]', resourceId);
};

export const getId = (obj: string | Item | undefined): string => {
  if (typeof obj === 'string') {
    return obj.split('/').slice(-1)[0];
  }

  if (typeof obj === 'object' && obj !== null && '@id' in obj) {
    return obj['@id']?.split('/').slice(-1)[0] ?? '';
  }

  return '';
};

export const parsePage = (resourceName: string, path: string) =>
  parseInt(
    new RegExp(`^/${resourceName}\\?page=(\\d+)`).exec(path)?.[1] ?? '1',
    10,
  );

export const getItemPaths = async <TData extends Item>(
  response: FetchResponse<PagedCollection<TData>> | undefined,
  resourceName: string,
  pathTemplate: string,
) => {
  if (!response) {
    return [];
  }

  try {
    const view = response.data['view'];
    const { last: last } = view ?? {};
    const paths =
      response.data['member']?.map((resourceData) =>
        getItemPath(resourceData['@id'] ?? '', pathTemplate),
      ) ?? [];
    const lastPage = parsePage(resourceName, last ?? '');

    for (let page = 2; page <= lastPage; page++) {
      paths.push(
        ...((
          await customFetch<PagedCollection<TData>>(
            `/${resourceName}?page=${page}`,
          )
        )?.data['member']?.map((resourceData) =>
          getItemPath(resourceData['@id'] ?? '', pathTemplate),
        ) ?? []),
      );
    }

    return paths;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const getCollectionPaths = async <TData extends Item>(
  response: FetchResponse<PagedCollection<TData>> | undefined,
  resourceName: string,
  pathTemplate: string,
) => {
  if (!response) {
    return [];
  }

  const view = response.data['view'];
  const { last: last } = view ?? {};
  const paths = [pathTemplate.replace('[page]', '1')];
  const lastPage = parsePage(resourceName, last ?? '');

  for (let page = 2; page <= lastPage; page++) {
    paths.push(pathTemplate.replace('[page]', page.toString()));
  }

  return paths;
};

export const getApiPath = ({
  path,
  page,
  itemsPerPage,
  groups,
  filters,
  order,
  pagination = true,
}: {
  path: string;
  page?: number;
  itemsPerPage?: number;
  groups?: string[];
  filters?: any[];
  order?: {
    name: string;
    direction: string;
  };
  pagination?: boolean;
}) => {
  const params = new URLSearchParams();

  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  if (page) {
    params.set('page', page.toString());
  }
  if (itemsPerPage) {
    params.set('itemsPerPage', itemsPerPage.toString());
  }
  if (groups) {
    groups.forEach((group) => params.append('groups[]', group));
  }
  if (filters) {
    filters.map(([name, value]) => params.append(name, value as string));
  }
  if (order) {
    params.set(`order[${order.name}]`, order.direction);
  }
  if (pagination === false) {
    params.set('pagination', 'false');
  }

  return `/${path}?${params.toString()}`;
};

export const getPagePath = (
  path: string,
  page?: number,
  itemsPerPage?: number,
) => {
  const pathArray = path.split('?');
  const pathParams = new URLSearchParams(pathArray[1] ?? '');
  const params = new URLSearchParams();
  const currentPage = parseInt(pathParams.get('page') ?? '1');
  const currentItemPerPage = parseInt(pathParams.get('itemsPerPage') ?? '10');

  params.delete('page');
  params.delete('itemsPerPage');

  if (currentPage > 1) {
    params.set('page', currentPage.toString());
  }

  if (currentItemPerPage !== 10) {
    params.set('itemsPerPage', currentItemPerPage.toString());
  }

  if (page && page > 0) {
    params.set('page', page.toString());
  }

  if (itemsPerPage) {
    params.set('itemsPerPage', itemsPerPage.toString());
  }

  params.sort();

  return `${pathArray[0]}?${params.toString()}`;
};

interface GetCollectionOptions {
  page?: number;
  itemsPerPage?: number;
  locale?: string;
}

export const getErrorCode = (error: unknown): number => {
  if (error instanceof HttpError) {
    return error.statusCode ?? 400;
  }

  return 400;
};

const errorMap: { [key: string]: any } = {
  'Failed to fetch': 'Network error. Try reloading the page.',
};

export const getErrorMessage = (
  error: unknown,
  msg: string = 'An error occurred.',
): string => {
  if (getErrorCode(error) === HTTP_STATUS_UNPROCESSABLE_ENTITY) {
    return msg;
  }

  if (error instanceof Error) {
    return errorMap[error.message] ?? error.message ?? msg;
  }

  return msg;
};
