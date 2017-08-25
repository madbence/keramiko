import fetch from './fetch';

const create = method => async (path, body) => {
  const res = await fetch('/api/v1' + path, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (res.status >= 400) {
    const body = await res.json();
    const err = new Error(body.message);
    err.code = res.status;
    err.url = res.url;
    err.headers = res.headers;
    throw err;
  }

  return res.json();
}

export const post = create('post');
export const put  = create('put')

export const get = async path => {
  const res = await fetch('/api/v1' + path, {
    method: 'get',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (res.status >= 400) {
    const body = await res.json();
    const err = new Error(body.message);
    err.code = res.status;
    err.url = res.url;
    err.headers = res.headers;
    throw err;
  }

  return res.json();
};
