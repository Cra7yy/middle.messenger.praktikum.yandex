const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Options = {
  method?: typeof METHODS[keyof typeof METHODS];
  data?: unknown;
  timeout?: number;
  headers?: Record<string, string>;
};

type HTTPMethod = (url: string, options?: Options) => Promise<XMLHttpRequest>;

function queryStringify(data: Record<string, unknown>) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

const API_URL = "https://ya-praktikum.tech/api/v2";

export class HTTPTransport {
  static API_URL = API_URL;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
  }
  get: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, { ...options, method: METHODS.GET }, options.timeout);
  };

  post: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, { ...options, method: METHODS.POST }, options.timeout);
  };

  put: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, { ...options, method: METHODS.PUT }, options.timeout);
  };

  delete: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, { ...options, method: METHODS.DELETE }, options.timeout);
  };

  request = (url: string, options: Options = {}, timeout = 5000): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(
        method,
        isGet && !!data
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url
      );

      if (!(data instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.withCredentials = true;

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        xhr.send(body as XMLHttpRequestBodyInit);
      }
    });
  };
}
