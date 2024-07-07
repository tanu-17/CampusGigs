// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Assuming AWS has been configured elsewhere in your code with the correct region and credentials
// Otherwise, uncomment and update the following line with your configuration
// AWS.config.update({ region: 'your-region', accessKeyId: 'your-accessKeyId', secretAccessKey: 'your-secretAccessKey' });

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const checkUserExists = async (id, password,role) => {
    const tableName = role === "student" ? "Students" : "Employers";
    const partitionKey = role === "student" ? "suid" : "employeeId";
    
    // Correctly setting the Key in the parameters using computed property names
    const params = {
        TableName: tableName,
        Key: { [partitionKey]: parseInt(id) }
    };
console.log(params, "PARAMS----------->")
    try {
        const data = await dynamoDB.get(params).promise();
        
        // If no item is found, the user does not exist
        if (!data.Item) {
            return { exists: false, body: { message: "User Not Found" , data: "NA" }};
        }
        
        // Here, implement secure password comparison, for demonstration we're doing a direct comparison
        // For production, consider using a secure hash comparison method
        const userPassword = data.Item.password;
        const isPasswordCorrect = userPassword === password;
        
        return {
            exists: true,
            body: { message: isPasswordCorrect ? "User Found" : "Incorrect Password" , data: isPasswordCorrect ? data.Item  : "NA" }
        };
        
    } catch (error) {
        console.error('Error checking user exists:', error);
        // Consider custom error handling or re-throwing specific errors for the caller to handle
        throw new Error('Error accessing database');
    }
};

module.exports = { checkUserExists };
