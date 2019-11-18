const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const sessionSecret = process.env.SESSION_SECRET || 'abc123';
const apiUrl = process.env.APIURL;

const aws = {
  region: process.env.AMAZON_SES_REGION,
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
};

module.exports = {
  apiUrl,
  aws,
  host,
  port,
  sessionSecret
};
