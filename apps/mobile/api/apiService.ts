import { API_URL } from "./config";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type Headers = Record<string, string>;
type Body = Record<string, any> | null;

interface MakeRequestOptions {
  method?: RequestMethod;
  body?: Body;
  headers?: Headers;
}

const makeRequest = async <T>(
  path: string,
  { method = "GET", body = null, headers = {} }: MakeRequestOptions
): Promise<T> => {
  if (!path) {
    throw new Error("Path not specified");
  }

  const isBodyAllowed = method !== "GET" && method !== "DELETE";

  const response = await fetch(`${API_URL}/${path}`, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: isBodyAllowed && body ? JSON.stringify(body) : undefined,
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${data?.error || response.statusText} `
    );
  }

  return data as T;
};

const apiService = {
  get: <T>(path: string, headers?: Headers) => {
    return makeRequest<T>(path, { method: "GET", headers });
  },
  post: <T>(path: string, body: Body, headers?: Headers) => {
    return makeRequest<T>(path, { method: "POST", body, headers });
  },
  put: <T>(path: string, body: Body, headers?: Headers) => {
    return makeRequest<T>(path, { method: "PUT", body, headers });
  },
  delete: <T>(path: string, headers?: Headers) => {
    return makeRequest(path, { method: "DELETE", headers });
  },
};

export default apiService;
