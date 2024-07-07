const { deleteFunction } = require("./dynamoDB.js");

exports.handler = async (event) => {
    console.log(event);
    try {
        const response = await deleteFunction(event.queryStringParameters);
        const { statusCode, body } = response;
        
        return {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ statusCode, message: body }),
            isBase64Encoded: false
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Internal server error" }),
            isBase64Encoded: false
        };
    }
};
