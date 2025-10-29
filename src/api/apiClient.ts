// src/api/apiClient.ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiClientOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  // allow sending raw body (FormData), so don't always stringify
  rawBody?: boolean;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 15000;

async function request<T>(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown,
  options: ApiClientOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;

  // if user passed a signal, we will race both signals
  const signals: AbortSignal[] = [];
  if (options.signal) signals.push(options.signal);
  signals.push(controller.signal);

  // race timeout with provided signal(s)
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(options.headers ?? {}),
  };

  // If body is JSON and not raw, stringify and set content-type
  let bodyToSend: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (options.rawBody) {
      // e.g. FormData or Blob
      bodyToSend = body as BodyInit;
      // fetch will set proper multipart headers automatically for FormData
    } else {
      headers["Content-Type"] = "application/json";
      bodyToSend = JSON.stringify(body);
    }
  }

  // placeholder: add authentication header later
  // e.g. const token = getAuthToken(); if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: bodyToSend,
      signal: controller.signal,
      // credentials: 'include' // optionally when using cookies
    });

    // Always clear timeout if we get a response
    clearTimeout(timeout);

    // If no content
    if (res.status === 204) {
      // @ts-ignore
      return null;
    }

    // Try to parse JSON; if it fails, throw
    const text = await res.text();
    const isJson = res.headers.get("content-type")?.includes("application/json");

    if (!res.ok) {
      // try parse JSON body for error message
      let errBody: any = text;
      try {
        errBody = isJson ? JSON.parse(text) : text;
      } catch {}
      const message = errBody?.message ?? res.statusText ?? "Request failed";
      const err = new Error(message);
      // attach extra info
      (err as any).status = res.status;
      (err as any).body = errBody;
      throw err;
    }

    if (!text) {
      // empty body but OK
      // @ts-ignore
      return null;
    }

    return isJson ? JSON.parse(text) : (text as unknown as T);
  } catch (err) {
    // normalize AbortError
    if ((err as any)?.name === "AbortError") {
      throw new Error("Request timed out or was aborted");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get: <T>(url: string, options?: ApiClientOptions) => request<T>(url, "GET", undefined, options),
  post: <T>(url: string, body?: unknown, options?: ApiClientOptions) => request<T>(url, "POST", body, options),
  put: <T>(url: string, body?: unknown, options?: ApiClientOptions) => request<T>(url, "PUT", body, options),
  del: <T>(url: string, options?: ApiClientOptions) => request<T>(url, "DELETE", undefined, options),
  patch: <T>(url: string, body?: unknown, options?: ApiClientOptions) => request<T>(url, "PATCH", body, options),
};
