const config = {
  uploadDir: process.env.UPLOAD_DIR,
  cdn: process.env.CDN,
};

const required = [
  'UPLOAD_DIR',
  'CDN',
];

for (const name of required) {
  if (process.env[name]) {
    continue;
  }
  throw new Error(`Missing env var: ${name}!`);
}

export default config;
