const mongoose = require("mongoose")

const userCreditSystem_Schema = new mongoose.Schema({
    userId : {
        type : String ,
        required : [true , "Provider user id"]
    },
    sms : {
        sms_score : {
            type : Number ,
            required : [true,"Provide sms score"] ,
            default : 0
        } ,
        balance_sms : {
            type  : Number ,
            required : [true,"provide the balance sms"] ,
            default : 0
        },
        credit_history_sms : {
            type : Array ,
            required : [true,"provide the credit history"]
        }
    },
    email : {
        email_score : {
            type : Number ,
            required : [true,"Provide sms score"] ,
            default : 0
        } ,
        email_sms : {
            type  : Number ,
            required : [true,"provide the balance sms"] ,
            default : 0
        },
        credit_history_email : {
            type : Array ,
            required : [true,"provide the credit history"]
        }
    },
    whatsapp : {
        whatsapp_score : {
            type : Number ,
            required : [true,"Provide sms score"] ,
            default : 0
        } ,
        balance_wp_msg : {
            type  : Number ,
            required : [true,"provide the balance sms"],
            default : 0
        },
        credit_history_wp : {
            type : Array ,
            required : [true,"provide the credit history"]
        }
    },
    social : {
        whatsapp_score : {
            type : Number ,
            required : [true,"Provide sms score"],
            default : 0
        } ,
        balance_wp_msg : {
            type  : Number ,
            required : [true,"provide the balance sms"],
            default : 0
        },
        credit_history_wp : {
            type : Array ,
            required : [true,"provide the credit history"]
        }
    }
}) 

const credit_system_Model = mongoose.model("credit_system",userCreditSystem_Schema)

module.exports = credit_system_Model
