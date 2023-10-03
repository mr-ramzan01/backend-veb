const XlsxStreamReader = require("xlsx-stream-reader");
const fs = require("fs");
const { promisify } = require("util");
const EmailLists = require("../../models/list/list.email");
const EmailListUsers = require("../../models/list/list.email.users");
const delay = promisify(setTimeout);

const getEmailList = async (req, res) => {
  try {
    if (req.profile) {
      let emailData = await EmailLists.find({ orgNo: req.profile.orgNo })
        .lean()
        .exec();

      for (let i = 0; i < emailData.length; i++) {
        let emailListCount = await EmailListUsers.find({
          listId: emailData[i],
        }).count();
        await EmailLists.findOneAndUpdate(
          { _id: emailData[i] },
          { $set: { listCount: emailListCount } }
        );
      }

      let data = await EmailLists.find({ orgNo: req.profile.orgNo });
      return res.status(200).send({
        message: "Email List Data",
        status: true,
        data: data,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const createEmailList = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Please provide data",
        status: false,
      });
    }
    if (req.profile) {
      req.body.orgNo = req.profile.orgNo;
      req.body.createdBy = req.profile._id;

      await EmailLists.create(req.body);

      return res.status(200).send({
        message: "List created Successfully",
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const addListUserOne = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Please provide data",
        status: false,
      });
    }
    if (req.profile) {
      let emailList = await EmailLists.findById({ _id: req.body._id });

      if (!emailList) {
        return res.status(200).send({
          message: "Something is wrong",
          status: false,
        });
      }

      let user = await EmailListUsers.findOne({
        email: req.body.email,
        orgNo: req.profile.orgNo,
        listId: emailList._id,
      });
      if (user) {
        return res.status(200).send({
          message: "User is already present",
          status: false,
        });
      }
      req.body.orgNo = req.profile.orgNo;
      req.body.createdBy = req.profile._id;
      req.body.listId = emailList._id;
      delete req.body._id;

      await EmailListUsers.create(req.body);
      let emailListCount = await EmailListUsers.find({
        listId: emailList._id,
      }).count();
      await EmailLists.findOneAndUpdate(
        { _id: emailList._id },
        { $set: { listCount: emailListCount } }
      );

      return res.status(200).send({
        message: "User added successfully",
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

const deleteEmailList = async (req, res) => {
  try {
    let { id } = req.params;
    if (id) {
      await EmailLists.deleteOne({ _id: id });
      await EmailListUsers.deleteMany({ listId: id });
      return res.status(200).send({
        message: "Email list deleted Successfully",
        status: true,
      });
    } else {
      return res.status(400).send({
        message: "please provide document id",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};

const uploadListUsers = async (req, res) => {
  try {
    if (req.profile) {
      const url = req.file.path;
      const workbookReader = new XlsxStreamReader();
      const ListSize = 100; // Adjust batch size as per your requirement
      let count = 0; // Initialize a counter variable
      let listCount = 0;
      //   const uniqueEntries = new Set(); // Set to store unique entries
      const processedData = [];
      let duplicateCount = 0;
      let alreadyUploadedCount = 0;
      let keys = [];
      let firstRow = true;
      let flag = false;
      let errormessage = "";
      let id = JSON.parse(req.body.id);
      try {
        const processRow = async (row) => {
          if (firstRow) {
            keys.push(...row.values);
            if (keys[0] === undefined) {
              keys.shift();
            }

            const fieldNames = [
              "email",
              "fullName",
              "gender",
              "dob",
              "mobileNo",
              "address",
              "zipCode",
              "companyName",
              "companySize",
              "anniversary",
              "jobTitle",
              "preferredLanguage",
              "nationality",
              "referalSource",
            ];
            firstRow = false;
            for (let i = 0; i < keys.length; i++) {
              if (!fieldNames.includes(keys[i])) {
                flag = true;
                errormessage = keys[i];
              }
            }
          } else {
            let val = [];
            val.push(...row.values);
            if (val[0] === undefined) {
              val.shift();
            }
            if (processedData.includes(val[0])) {
              duplicateCount++; // Increment the duplicate count
              return; // Skip saving duplicate data
            }
            const data = {
              orgNo: req.profile.orgNo,
              createdBy: req.profile._id,
              listId: id,
            };
            for (let i = 0; i < keys.length; i++) {
              if (val[i]) {
                if (keys[i] === "dob" || keys[i] === "anniversary") {
                  data[keys[i]] = val[i].replace(/\//g, "-");
                } else {
                  data[keys[i]] = val[i];
                }
              }
            }

            processedData.push(val[0]);
            let user = await EmailListUsers.findOne({
              email: data.email,
              orgNo: req.profile.orgNo,
              listId: id,
            });
            if (user) {
              alreadyUploadedCount++;
            } else {
              await EmailListUsers.create(data);
              let emailListCount = await EmailListUsers.find({
                listId: id,
              }).count();
              await EmailLists.findOneAndUpdate(
                { _id: id },
                { $set: { listCount: emailListCount } }
              );
              count++; // Increment the counter
            }

            if (count % ListSize === 0) {
              listCount++;
              console.log(`List ${listCount}: ${count} data added to MongoDB.`);
              await delay(5000); // Delay between batches (adjust the timeout as per your needs)
            }
          }
        };

        workbookReader.on("worksheet", (sheetReader) => {
          sheetReader.on("row", async (row) => {
            if (!flag) {
              await processRow(row);
            }
          });

          sheetReader.on("end", async () => {
            console.log(`Total ${count} data added to MongoDB.`);
            console.log(`Total data from Excel: ${count}`);
            console.log(`Duplicate data: ${duplicateCount}`);
            console.log(
              `Duplicate data already present: ${alreadyUploadedCount}`
            );
            if (flag) {
              return res.send({
                message: `Invalid field ${errormessage}`,
                status: false,
              });
            }

            let emailListCount = await EmailListUsers.find({
              listId: id,
            }).count();
            await EmailLists.findOneAndUpdate(
              { _id: id },
              { $set: { listCount: emailListCount } }
            );

            return res.status(200).send({
              message: "Excel data saved successfully!",
              status: true,
            });
          });

          sheetReader.on("error", (err) => {
            console.error("An error occurred while reading the sheet:", err);
            return res.status(500).send({
              message: "Error occurred while saving Excel data.",
              status: false,
            });
          });

          sheetReader.process();
        });

        fs.createReadStream(url).pipe(workbookReader);
      } catch (error) {
        return res.status(500).send({
          message: "An error occurred while processing the file.",
          status: false,
        });
      }
    } else {
      return res.status(401).send({
        message: "You are not authenticated",
        status: false,
      });
    }
  } catch (error) {
    return res.send({ message: error.message, status: false });
  }
};

module.exports = {
  addListUserOne,
  uploadListUsers,
  createEmailList,
  getEmailList,
  deleteEmailList,
};
