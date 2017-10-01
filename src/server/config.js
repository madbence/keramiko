const config = {
  uploadDir: process.env.UPLOAD_DIR,
  cdn: process.env.CDN,
  services: {
    'google-analytics': process.env.GOOGLE_ANALYTICS_ID,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  dkim: {
    domain: process.env.DKIM_DOMAIN,
    selector: process.env.DKIM_SELECTOR,
    privateKey: process.env.DKIM_PRIVATE_KEY,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
  },
};

const required = [
  'UPLOAD_DIR',
  'CDN',
];

for (const name of required) {
  if (process.env[name]) continue;

  throw new Error(`Missing env var: ${name}!`);
}

export default config;
