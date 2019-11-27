const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const apiUrl = process.env.API_URL;
const jwtSecret = process.env.JWT_SECRET || 'abc123';

const aws = {
  region: process.env.AMAZON_SES_REGION,
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
};

module.exports = {
  apiUrl,
  aws,
  jwtSecret,
  host,
  port
};
