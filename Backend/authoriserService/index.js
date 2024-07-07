const { checkUserExists } = require("./dynamoDB.js");

exports.handler = async (event) => {
    console.log("Incoming Event:", event);
    // Parse the JSON string in the body property
    const parsedBody = JSON.parse(event.body);

    // Extract suid, password and role
    const { id, password,role } = parsedBody;
    
    try {
        const response = await checkUserExists(id, password,role);
        
        // Determine status code based on the response from checkUserExists
        let statusCode;
        switch (response.body.message) {
            case "User Found":
                statusCode = 200;
                break;
            case "Incorrect Password":
                statusCode = 400;
                break;
            case "User Not Found":
                statusCode = 404;
                break;
            default:
                // Handle unexpected response messages
                statusCode = 500;
                console.error('Unexpected response message:', response.message);
                return {
                    statusCode: statusCode,
                    headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                                "Content-Type": "application/json" // Ensure this is set for JSON responses
                    },
                                body: JSON.stringify({ statusCode, message: response.body }),
            isBase64Encoded: false
                };
        }

        console.log({statusCode, message: response.body.message , data : response.body.data });
        
        return {
            statusCode: statusCode,
            headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                        "Content-Type": "application/json" // Ensure this is set for JSON responses
            },
            body: JSON.stringify({statusCode, message: response.body.message , data : response.body.data }),
            isBase64Encoded: false
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
           headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
     "Content-Type": "application/json" // Ensure this is set for JSON responses
            },
             body: JSON.stringify({ statusCode : 500, message: "Internal Server Error" }),
             isBase64Encoded: false
        };
    }
};
