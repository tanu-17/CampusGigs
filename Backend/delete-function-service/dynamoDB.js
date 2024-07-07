const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const deleteFunction = async (queryStringParameters) => {
    if(queryStringParameters.jobId) {
        const params = {
            TableName: 'Jobs', 
            Key: {
                'jobId': queryStringParameters.jobId 
            }};
    try {
        const result = await documentClient.delete(params).promise();
        console.log('Deletion successful:', result);
        return { statusCode: 200, body: 'Deleted Job successfully' };
    } catch (error) {
        console.error('Error performing deletion in DynamoDB:', error);
        return { statusCode: 500, body: 'Failed to perform operation' };
    }
        
    } if(queryStringParameters.applicationId){
        const params = {
            TableName: 'StudentsApplicationStatus', 
            Key: {
                'applicationId': queryStringParameters.applicationId
            }};
        try {
            const result = await documentClient.delete(params).promise();
            console.log('Deletion successful:', result);
            return { statusCode: 200, body: 'Deleted Application successfully' };
        } catch (error) {
            console.error('Error performing deletion in DynamoDB:', error);
            return { statusCode: 500, body: 'Failed to perform operation' };
        }
    }
};

module.exports = { deleteFunction };
