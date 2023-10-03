const Smtp = require("../../models/smtp/smtp.schema");

const addSmtp = async (req, res) => {
  try {
    if(!req.body) {
        return res.status(400).send({
          message: "Please provide data",
          status: false,
        })
    }
    if (req.profile) {
      
      req.body.orgNo = req.profile.orgNo;
      req.body.createdBy = req.profile._id;
      
      await Smtp.create(req.body);
      
      return res.status(200).send({
        message: "Smtp added successfully",
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

const getSmtp = async (req, res) => {
  try {
    if (req.profile) {
      let data = await Smtp.find({orgNo: req.profile.orgNo});
      return res.status(200).send({
        message: "Smtp data",
        status: true,
        data: data
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

const deleteSmtp = async (req, res) => {
  try {
    let {id} = req.params;
    if (id) {
      await Smtp.deleteOne({_id: id});
      return res.status(200).send({
        message: "Smtp deleted Successfully",
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


const statusChangeSmtp = async (req, res) => {
  try {
    if (req.body) {
      await Smtp.updateOne({_id: req.body._id }, req.body);
      return res.status(200).send({
        message: "Status Changed Successfully",
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





module.exports = { addSmtp, getSmtp, deleteSmtp, statusChangeSmtp };
