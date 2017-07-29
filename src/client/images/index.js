export const upload = async file => {
  const form = new FormData();

  form.append('file', file);

  const req = new XMLHttpRequest();
  req.open('POST', '/api/v1/images');
  await new Promise((resolve, reject) => {
    req.addEventListener('load', () => {
      if (req.status === 200) {
        return resolve();
      }
      reject();
    });
    req.send(form);
  });

  return req.response;
};
