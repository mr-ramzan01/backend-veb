const requestIp = require("request-ip")
const browser = require("browser-detect")

const getIp = (req,res,next)=>{
    const clientIp = requestIp.getClientIp(req)
    const result = browser(req.headers['user-agent'])
    req.body.ip = clientIp
    req.body.browsername = result.name 
    req.body.os = result.os 
    req.body.mobile = result.mobile
    // console.log("result",result)
    next()
}

module.exports = getIp