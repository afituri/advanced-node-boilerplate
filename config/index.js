const port = process.env.PORT || process.argv[2];
const host = process.env.HOST;
const sessionSecret = process.env.SESSION_SECRET || "abc123";

module.exports = {
  host,
  sessionSecret,
  port
};
