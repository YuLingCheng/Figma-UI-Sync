const BASE_URL = "https://api.github.com/repos/Dashlane/ui-components";

type Body = any;
export const makeApiCall = async (
  url,
  config: { token?: string; method?: string; body?: Body } = {}
) => {
  const headers = config.token
    ? {
        Authorization: `token ${config.token}`
      }
    : {};

  const body = config.body ? JSON.stringify(config.body) : null;
  const response = await fetch(`${BASE_URL}/${url}`, {
    ...config,
    ...{
      headers,
      body
    }
  });
  return response.json();
};
