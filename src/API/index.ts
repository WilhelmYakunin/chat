import { IncomingHTTPHeaders } from '../../entry-server';

type reqOptions = {
  headers: IncomingHTTPHeaders;
  timeout: number;
  method: string;
  data: XMLHttpRequestBodyInit;
  tries: number;
};
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
  options: reqOptions,
  timeout = 5000
): Promise<XMLHttpRequest> => {
  const { method, data } = options;

  return new Promise((resolve, reject) => {
    if (!method) {
      reject('No method');
      return;
    }

    const xhr = new XMLHttpRequest();
    const isGet = method === METHODS.GET;

    xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

    // Object.keys(headers).forEach((key) =>
    //   xhr.setRequestHeader(key, headers[key])
    // );

    xhr.onload = function () {
      resolve(xhr);
    };

    xhr.onabort = reject;
    xhr.onerror = reject;

    xhr.timeout = timeout;
    xhr.ontimeout = reject;

    if (isGet || !data) {
      xhr.send();
    } else {
      xhr.send(data);
    }
  });
};

export const get = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.GET }, options.timeout);
export const post = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.POST }, options.timeout);
export const put = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.PUT }, options.timeout);
export const delet = (url: string, options: reqOptions) =>
  request(url, { ...options, method: METHODS.DELET }, options.timeout);

export const fetchWithRetry = (
  url: string,
  options: reqOptions
): Promise<XMLHttpRequest> => {
  const { tries } = options;

  const onReject = (err: unknown) => {
    if (tries <= 0) throw err;
    return fetchWithRetry(url, { ...options, tries: options.tries - 1 });
  };

  return request(url, options).catch(onReject);
};
