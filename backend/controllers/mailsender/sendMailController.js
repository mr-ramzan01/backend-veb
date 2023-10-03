require("dotenv").config()
const nodemailer = require("nodemailer")

let mailTransporter = nodemailer.createTransport({
    service : "gmail" ,
    auth : {
        user : "acekhurana9@gmail.com" ,
        pass : process.env.GOOGLEMAILKEY
    }
})

// let mailOption = {
//     from : "acekhurana9@gmail.com",
//     to : "ghanishtkhurana9@gmail.com" ,
//     subject : "Test email subject" ,
//     text : "Test email text", 
//     html: "<b>Hello world?</b>",
// }

const sendMailController = async(req,res)=>{
    let mailOption = {
        from : "acekhurana9@gmail.com",
        to : "ghanishtkhurana9@gmail.com" ,
        subject : "Test email subject" ,
        text : "Test email text", 
        html: "<b>Hello world?</b>",
    }
 try {
    mailTransporter.sendMail(mailOption,(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Email sent" , info.response)
        }
    })
    return res.send("sending mail").status(200)
 } catch (error) {
    return res.status(400).send()
 }
}

module.exports = sendMailController