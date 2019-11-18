const aws = require('aws-sdk');

const { region, accessKeyId, secretAccessKey } = require('../config').aws;
// Needs to be refactored with async await style.
const sendEmail = options => {
  aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
  });

  const ses = new aws.SES({ apiVersion: 'latest' });

  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Source: options.from,
        Destination: {
          CcAddresses: options.cc,
          ToAddresses: options.to
        },
        Message: {
          Subject: {
            Data: options.subject
          },
          Body: {
            Html: {
              Data: options.body
            }
          }
        },
        ReplyToAddresses: options.replyTo
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
};

module.exports = sendEmail;
