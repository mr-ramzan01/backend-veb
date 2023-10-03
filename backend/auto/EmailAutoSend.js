const cron = require("node-cron");
const Campaign = require("../models/campaign/campaign");
const Smtp = require("../models/smtp/smtp.schema");
const CampaignEmailLogs = require("../models/campaign/campaign.email.logs");
const SendEmailViaBrevoSmtp = require("../email/SendEmailViaBrevoSmtp");
const SendEmailViaElasticEmailSmtp = require("../email/SendEmailViaElasticEmailSmtp");
const SendEmailViaMailgunSmtp = require("../email/SendEmailViaMailgunSmtp");
const SendEmailViaSparkpostSmtp = require("../email/SendEmailViaSparkpostSmtp");

async function fetchAndSendEmail() {
  try {

    // finding all Data
    let data = await Campaign.find({
      $and: [
        { deliveryDate: { $lte: new Date().toISOString().split('T')[0] } },
        { deliveryTime: { $lte: new Date().toTimeString().split(' ')[0] } },
        { status: "pending" },
      ],
    });

    console.log('data', data.length);


    let i = 0;

    while (i < data.length) {
      const todata = data[i].to;
      // finding smtp for sales
    const smtpData = await Smtp.findOne({
        orgNo: data[i].orgNo,
      });
  

      for (let j = 0; j < todata.length; j += 10) {
        const fiveEmails = todata.slice(j, j + 10);

        // Sending mail to five peoples
        for (let k = 0; k < fiveEmails.length; k++) {
          if (fiveEmails[k].status === "pending") {
            let newData = {};
            newData.template = data[i].template;
            newData.emailSubject = data[i].emailSubject;
            newData.fromEmail = data[i].fromEmail;
            newData.fromName = data[i].fromName;
            // newData.attachment = data[i].attachment;
            // newData.filename = data[i].filename;
            newData.replyTo = data[i].replyTo;
            newData.email = fiveEmails[k].email;

            let result = await SendEmailViaBrevoSmtp(smtpData, newData);
            // let result = await SendEmailViaElasticEmailSmtp(smtpData, newData);
            // let result = await SendEmailViaMailgunSmtp(smtpData, newData);
            // let result = await SendEmailViaSparkpostSmtp(smtpData, newData);
            console.log(result, 'reslut');
            result.createdBy = data[i].createdBy;
            result.orgNo = data[i].orgNo;
            result.campaignId = data[i]._id;

            await CampaignEmailLogs.create(result);

            // Updating the status of every email and setting the logs 
            await Campaign.updateOne(
              {
                _id: data[i]._id,
                "to._id": fiveEmails[k]._id,
              },
              {
                $set: { "to.$.status": "sent" },
              }
            );
          }
        }

        // Wait for 1 second between processing emails
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // updating every document
      await Campaign.updateOne({_id: data[i]}, {$set: {status: 'done'}});

      i++; // Move to the next document

      if (i < data.length) {
        // Wait for 1 seconds before processing the next document
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('Error in sending email:', error);
  }
}

cron.schedule("* * * * *", () => {
  fetchAndSendEmail();
});
