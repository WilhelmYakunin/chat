import { User } from '../pages/settings/model';
import { IChat } from '../store/store';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELET: 'DELETE',
};

const queryStringify = (data: XMLHttpRequestBodyInit) => {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${data[key as keyof XMLHttpRequestBodyInit]}${
      index < keys.length - 1 ? '&' : ''
    }`;
  }, '?');
};

const request = (
  url: string,
  options: reqOptions
): Promise<XMLHttpRequest | User | IChat[]> => {
  const { method, data } = options;

  return new Promise((resolve, reject) => {
    if (!method) {
      reject('No method');
      return;
    }

    const xhr = new window.XMLHttpRequest();
    const isGet = method === METHODS.GET;

    xhr.withCredentials = true;

    xhr.open(
      method,
      isGet && !!data ? `${url}${queryStringify(data)}` : url,
      true
    );

    const headers = options.headers;
    if (headers) {
      Object.entries(headers).forEach(([header, value]) =>
        xhr.setRequestHeader(header, value as string)
      );
    }

    xhr.onload = function () {
      let resp;

      if (xhr.response === 'OK') {
        resp = { status: 'OK' };
      } else {
        resp = JSON.parse(xhr.response);
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(resp);
      } else {
        reject(resp);
      }

      resolve(xhr);
    };

    if (options.timeout) xhr.timeout = options.timeout;
    xhr.ontimeout = reject;

    if (isGet || !data) {
      xhr.send();
    } else {
      xhr.send(data);
    }

    xhr.onabort = reject;
    xhr.onerror = reject;
  });
};

export const get = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.GET });
export const post = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.POST });
export const put = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.PUT });
export const delet = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.DELET });

export const fetchWithRetry = (
  url: string,
  options: reqOptions
): Promise<XMLHttpRequest | User | IChat[] | User[] | IChat> => {
  const { tries } = options;

  const onReject = (err: unknown) => {
    if (tries <= 0) throw err;
    return fetchWithRetry(url, { ...options, tries: options.tries - 1 });
  };

  return request(url, options).catch(onReject);
};

type reqOptions = {
  headers?: { [x: string]: string };
  timeout?: number;
  method?: string;
  data?: XMLHttpRequestBodyInit;
  tries: number;
};

// interface IncomingHttpHeaders {
//   accept?: string | undefined;
//   'accept-language'?: string | undefined;
//   'accept-patch'?: string | undefined;
//   'accept-ranges'?: string | undefined;
//   'access-control-allow-credentials'?: string | undefined;
//   'access-control-allow-headers'?: string | undefined;
//   'access-control-allow-methods'?: string | undefined;
//   'access-control-allow-origin'?: string | undefined;
//   'access-control-expose-headers'?: string | undefined;
//   'access-control-max-age'?: string | undefined;
//   'access-control-request-headers'?: string | undefined;
//   'access-control-request-method'?: string | undefined;
//   age?: string | undefined;
//   allow?: string | undefined;
//   'alt-svc'?: string | undefined;
//   authorization?: string | undefined;
//   'cache-control'?: string | undefined;
//   connection?: string | undefined;
//   'content-disposition'?: string | undefined;
//   'content-encoding'?: string | undefined;
//   'content-language'?: string | undefined;
//   'content-length'?: string | undefined;
//   'content-location'?: string | undefined;
//   'content-range'?: string | undefined;
//   'Content-type'?: string | undefined;
//   cookie?: string | undefined;
//   date?: string | undefined;
//   etag?: string | undefined;
//   expect?: string | undefined;
//   expires?: string | undefined;
//   forwarded?: string | undefined;
//   from?: string | undefined;
//   host?: string | undefined;
//   'if-match'?: string | undefined;
//   'if-modified-since'?: string | undefined;
//   'if-none-match'?: string | undefined;
//   'if-unmodified-since'?: string | undefined;
//   'last-modified'?: string | undefined;
//   location?: string | undefined;
//   origin?: string | undefined;
//   pragma?: string | undefined;
//   'proxy-authenticate'?: string | undefined;
//   'proxy-authorization'?: string | undefined;
//   'public-key-pins'?: string | undefined;
//   range?: string | undefined;
//   referer?: string | undefined;
//   'retry-after'?: string | undefined;
//   'sec-websocket-accept'?: string | undefined;
//   'sec-websocket-extensions'?: string | undefined;
//   'sec-websocket-key'?: string | undefined;
//   'sec-websocket-protocol'?: string | undefined;
//   'sec-websocket-version'?: string | undefined;
//   'set-cookie'?: string[] | undefined;
//   'strict-transport-security'?: string | undefined;
//   tk?: string | undefined;
//   trailer?: string | undefined;
//   'transfer-encoding'?: string | undefined;
//   upgrade?: string | undefined;
//   'user-agent'?: string | undefined;
//   vary?: string | undefined;
//   via?: string | undefined;
//   warning?: string | undefined;
//   'www-authenticate'?: string | undefined;
// }
