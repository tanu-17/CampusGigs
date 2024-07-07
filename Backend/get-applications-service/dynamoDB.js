const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

// Retrieve applications based on job ID and application status
async function getApplications({ jobId, status }) {
    const statuses = status.includes(',') ? status.split(',') : [status]
    let results = [];
    for (let status of statuses) {
        const params = {
            TableName: "StudentsApplicationStatus",
            IndexName: "jobId-applicationStatus-index",
            KeyConditionExpression: "jobId = :jobId and applicationStatus = :status",
            ExpressionAttributeValues: {
                ":jobId": jobId,
                ":status": status
            }
        };

        try {
            const data = await documentClient.query(params).promise();
            results = results.concat(data.Items);
        } catch (err) {
            console.error("Error querying DynamoDB:", err);
            throw new Error('Failed to query applications for status ' + status);
        }
    }

    return results;
}

// Fetch details for multiple students based on a list of student IDs
async function getStudentDetails(studentIds) {
    if (studentIds.length === 0) return [];

    const keys = studentIds.map(id => ({ suid: id }));
    const params = {
        RequestItems: {
            'Students': {
                Keys: keys
            }
        }
    };

    try {
        const results = await documentClient.batchGet(params).promise();
        return results.Responses.Students;
    } catch (error) {
        console.error('Error fetching from DynamoDB:', error);
        throw new Error('Failed to fetch student details');
    }
}

// Main handler function to merge application and student details
async function getApplicationsFunction(queryStringParameters) {
    const appliedApplications = await getApplications(queryStringParameters);
    if (appliedApplications.length === 0) return { statusCode: 200, body: [] };

    const studentIds = appliedApplications.map(app => app.studentId);
    const students = await getStudentDetails(studentIds);

    const mergedInformation = students.map(student => {
        const application = appliedApplications.find(app => app.studentId === student.suid);
        if (application) {
            console.log(application); // Debugging
            delete student.password;
            delete student.suid;
            return { ...student, ...application };
        }
    }).filter(Boolean);

    console.log(mergedInformation); // Debugging
    return { statusCode: 200, body: mergedInformation };
};

module.exports = { getApplicationsFunction };
