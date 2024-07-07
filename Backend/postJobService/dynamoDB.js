const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const applyJobFunction = async (body) => {
    const tableName = 'Jobs';

    // Generate a jobId if not provided, else use the provided one.
    const jobId = body.jobId || uuidv4();
    const jobDeadlineDate = new Date(body.jobDeadline)
    const ttl = Math.floor((jobDeadlineDate.getTime() + 7 * 24 * 60 * 60 * 1000) / 1000);
    const itemFields = {
        ...body,
        jobPostedByEmployeeId: parseInt(body.employeeId),
        jobPostingDate: new Date().toISOString().split('T')[0],
        jobPayRate: `$${body.jobPayRate}`,
        ttl
    };

    // Remove jobId from itemFields if it exists to prevent trying to update the key
    delete itemFields.jobId;
    delete itemFields.employeeId; // Remove the original employeeId field

    // Update expression components
    let updateExpression = 'set ';
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    Object.keys(itemFields).forEach((key, idx) => {
        let expressionKey = `#key${idx}`; // Use a placeholder to avoid reserved word conflicts
        updateExpression += `${idx > 0 ? ', ' : ''}${expressionKey} = :val${idx}`;
        expressionAttributeValues[`:val${idx}`] = itemFields[key];
        expressionAttributeNames[expressionKey] = key;
    });

    const params = {
        TableName: tableName,
        Key: { jobId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDB.update(params).promise();
        console.log('Operation successful:', result);
        return { statusCode: 200, body: 'Item added successfully' };
    } catch (error) {
        console.error('Error performing operation in DynamoDB:', error);
        return { statusCode: 500, body: 'Failed to perform operation' };
    }
};

module.exports = { applyJobFunction };
