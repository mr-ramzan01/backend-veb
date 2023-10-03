const nodemailer = require("nodemailer");
const fs = require("fs");

const SendEmailViaSparkpostSmtp = async (SMTP, data) => {

  let transporter = nodemailer.createTransport(
    {
        host: SMTP.hostName,
        port: SMTP.smtpPort,
        auth: {
          user: SMTP.smtpUsername,
          pass: SMTP.smtpPassword,
        },
      }
  );

  let res = await transporter.sendMail({
    from: `"${data.fromName}" <${data.fromEmail}>`,
    to: `${data.email}`,
    subject: `${data.emailSubject}`,
    html: data.template,
  });
  return res;
};

module.exports = SendEmailViaSparkpostSmtp;
