const fs = require("fs");
const unzipper = require("unzipper");
const CampaignPreview = require("../../models/campaign/campaign.preview");
const path = require("path");

const createPreviewData = async (req, res) => {
  try {
    if (req.profile) {
      req.body.orgNo = req.profile.orgNo;
      req.body.createdBy = req.profile._id;

      let data = await CampaignPreview.findOne({
        createdBy: req.profile._id,
        orgNo: req.profile.orgNo,
      });

      if (data) {
        await CampaignPreview.updateOne(
          { _id: data.id, orgNo: data.orgNo },
          req.body
        );
      } else {
        await CampaignPreview.create(req.body);
      }

      return res.status(200).send({
        message: "Saved data successfully",
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

const getPreviewData = async (req, res) => {
  try {
    if (req.profile) {
      let data = await CampaignPreview.findOne({
        createdBy: req.profile._id,
        orgNo: req.profile.orgNo,
      });

      return res.status(200).send({
        message: "Preview Data",
        status: true,
        data,
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

const uploadTemplate = async (req, res) => {
  try {
    if (req.profile) {
      if (!req.file) {
        return res.status(404).send({
          message: "File not found",
          status: false,
        });
      }
      const extractPath = "uploads";
      const readStream = fs.createReadStream(req.file.path);

      if (req.file.mimetype === "application/zip" || req.file.mimetype === "application/x-zip-compressed") {
        readStream
          .pipe(unzipper.Extract({ path: extractPath }))
          .on("close", () => {
            // onsuccessfully extracting the folder
            fs.readdir(
              `uploads/${req.file.originalname.replace(".zip", "")}`,
              async (err, files) => {
                if (err) {
                  console.error("Error reading directory:", err);
                  const fileContent = fs.readFileSync(
                    `uploads/${req.file.originalname.replace(".zip", "")}.html`
                  );

                  let template = fileContent.toString();

                  // Deleting the file
                  fs.unlink(req.file.path, (err) => {
                    if (err) {
                      console.error(`Error deleting file: ${err.message}`);
                    } else {
                      console.log(`File has been deleted.`);
                    }
                  });

                  const filePath = `uploads/${req.file.originalname.replace(
                    ".zip",
                    ""
                  )}.html`;

                  // Deleting the extracted file
                  fs.unlink(filePath, (err) => {
                    if (err) {
                      console.error(
                        `Error deleting extracted file: ${err.message}`
                      );
                    } else {
                      console.log(`Extracted File has been deleted.`);
                    }
                  });

                  await CampaignPreview.updateOne(
                    { createdBy: req.profile._id, orgNo: req.profile.orgNo },
                    { template }
                  );

                  return res.status(200).send({
                    message: "Uploaded",
                    status: true,
                    data: template,
                  });
                }

                // Use Array.filter to select only files with a .html extension
                const htmlFiles = files.filter(
                  (file) => path.extname(file) === ".html"
                );

                const fileContent = fs.readFileSync(
                  `uploads/${req.file.originalname.replace(".zip", "")}/${
                    htmlFiles[0]
                  }`
                );
                let template = fileContent.toString();

                // Deleting the file
                fs.unlink(req.file.path, (err) => {
                  if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                  } else {
                    console.log(`File has been deleted.`);
                  }
                });

                // Deleting the folder
                fs.rm(
                  `uploads/${req.file.originalname.replace(".zip", "")}`,
                  { recursive: true },
                  (err) => {
                    if (err) {
                      console.error(`Error deleting folder: ${err.message}`);
                    } else {
                      console.log(`Folder has been deleted.`);
                    }
                  }
                );
                await CampaignPreview.updateOne(
                  { createdBy: req.profile._id, orgNo: req.profile.orgNo },
                  { template }
                );
                return res.status(200).send({
                  message: "Uploaded",
                  status: true,
                  data: template,
                });
              }
            );
          })
          .on("error", (err) => {
            console.error("Error:", err);
            return res.status(500).send({
              message: "Something went wrong",
              status: false,
            });
          });
      } else {
        return res.status(403).send({
          message: "Invalid file type",
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

module.exports = { createPreviewData, getPreviewData, uploadTemplate };
