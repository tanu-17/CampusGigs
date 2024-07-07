const AWS = require('aws-sdk');
//const { v4: uuidv4 } = require('uuid');

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const applyJobFunction = async (body) => {
    const data = await getJobDetails(body.jobId);
    const finalResponse = await postApplicationForStudent(body,data.ttl);
    return {finalResponse,data};
};

const getJobDetails = async (jobId) => {
    const params = {
        TableName: 'Jobs', 
        Key: {
            'jobId': jobId 
        }
    };

    try {
        const data = await dynamoDB.get(params).promise();
        if (!data.Item) {
            throw new Error("Job doesn't exist");
        }
        return data.Item;
    } catch (error) {
        throw new Error(error.message);
    }
};

const postApplicationForStudent = async(body,ttl) => {
    const applicationId = `${body.studentId}-${body.jobId}`;
    const item = {
        studentId : parseInt(body.studentId,10),
        jobId : body.jobId,
        applicationId,
        applicationStatus: "applied",
        applicationAppliedDate: new Date().toISOString().split('T')[0],
        ttl
    };

    // Define parameters for DynamoDB operation
    const params = {
        TableName: 'StudentsApplicationStatus',
        Item: item,
        ConditionExpression: 'attribute_not_exists(applicationId)' // Ensures the applicationId is unique
    };

    try {
        await dynamoDB.put(params).promise();  // Attempt to insert the item
        console.log('Operation successful');
        return { statusCode: 200, body: 'Item added successfully' };
    } catch (error) {
        if(error.code === "ConditionalCheckFailedException" && error.statusCode === 400){
            console.error('Error in DynamoDB operation:', error);
            return { statusCode: 500, body: 'Duplicate entry' };
        }
        console.error('Error in DynamoDB operation:', error);
        return { statusCode: 500, body: 'Failure occured while put operation' };
    }
}


module.exports = { applyJobFunction };
