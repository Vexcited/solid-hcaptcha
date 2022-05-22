export interface GenerateQueryParams {
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | null
}

export const generateQuery = (params: GenerateQueryParams) => {
  const entries = Object.entries(params);
  const values = entries.filter(([_key, value]) => value || value === false);

  const queries = values.map(([key, value]) => {
    if (!value) return;
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  });

  const query = queries.join("&");
  return query;
};

