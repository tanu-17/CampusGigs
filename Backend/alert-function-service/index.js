const { sendJobAlert } = require("./ses.js");

exports.handler = async (event) => {
    console.log('Incoming Event',event);
    const response = await sendJobAlert(event);
    return {
        statusCode: response.statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Content-Type": "application/json"
        },
        isBase64Encoded: false
    };
};