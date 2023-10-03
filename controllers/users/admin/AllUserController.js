const Users = require("../../../models/users.schema")

const AllUserController = async(req,res)=>{
    try {
        let userId = req.body.userId 
        const user = await Users.findOne({_id : userId})
        if(user.role === "SuperAdmin")
        {
            let allUser = await Users.find() 
            res.status(200).send({message : "Data fetched successfully",status : true,data : allUser})
        }
        else{
            res.status(404).send({message : "Access Denied",status: false})
        }
    } catch (error) {
        res.status(400).send({message : error.message,status : false})
    }
}

module.exports = AllUserController