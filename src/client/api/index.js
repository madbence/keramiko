import fetch from './fetch';

const create = method => async (path, body) => {
  const res = await fetch('/api/v1' + path, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export const post = create('post');
export const put  = create('put')

export const get = async path => {
  const res = await fetch('/api/v1' + path, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
    },
  });

  return res.json();
};
