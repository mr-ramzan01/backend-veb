require('dotenv').config()

const DEBUG_MODE = process.env.DEBUG_MODE || "false"
const {ValidationError} = require('joi')
const CustomErrorHandler = require('../utils/customErrorHandler/CustomErrorHandler');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}

module.exports = errorHandler