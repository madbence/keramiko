import jwt from 'jsonwebtoken';

export const sign = (payload, secret) => new Promise((resolve, reject) => {
  jwt.sign(payload, secret, (err, token) => {
    if (err) return reject(err);
    resolve(token);
  });
});

export const verify = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, payload) => {
    if (err) return reject(err);
    resolve(payload);
  });
});
