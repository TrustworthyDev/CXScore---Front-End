export type QueryParams = Record<string, string>;

export const extractQueryParams = (search: string): QueryParams => {
  const params: QueryParams = {};
  const searchParams = new URLSearchParams(search);

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
};
