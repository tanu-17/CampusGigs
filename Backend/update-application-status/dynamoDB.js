const AWS = require('aws-sdk');
// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const updateStudentApplicationStatus = async (body) => {
    const data = await getJobDetails(body.applicationId);
    console.log(data);
    const updateStatusReponse = await updateApplicationStatus(body);
    const finalResponse = body.role === "student" && body.status === "enrolled" ? await updateEmploymentStatusforStudent(body.applicationId,data) : updateStatusReponse;
    return {finalResponse,data};
};

const getJobDetails = async (applicationId) => {
    const jobId = applicationId.substring(applicationId.indexOf("-") + 1);
    const params = {
        TableName: 'Jobs', 
        Key: {
            'jobId': jobId 
        }
    };
    
    console.log(params)

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

const updateEmploymentStatusforStudent = async (applicationId, data) => {
    const studentId = parseInt(applicationId.split("-")[0]);
    const jobDetails = { jobId: data.jobId, jobCategory: data.jobCategory };
    const params = {
        TableName: 'Students', // Replace with your table name
        Key: { 'suid': studentId },
        UpdateExpression: 'SET #noOfEmployedJobs = if_not_exists(#noOfEmployedJobs, :start) + :inc, #employedJobs = list_append(if_not_exists(#employedJobs, :empty_list), :jobDetails)',
        ExpressionAttributeNames: {
            '#noOfEmployedJobs': 'noOfEmployedJobs',
            '#employedJobs': 'employedJobs'
        },
        ExpressionAttributeValues: {
            ':start': 0,
            ':inc': 1,
            ':empty_list': [],
            ':jobDetails': [jobDetails]
        },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        await dynamoDB.update(params).promise();
        return { statusCode: 200, body: "Updated Successfully." };
    } catch (error) {
        console.error('Update failed:', error);
        return { statusCode: 500, body: "Error occurred while updating" };
    }
};


const updateApplicationStatus = async (body) => {
    const { applicationId, status } = body;
    const params = {
        TableName: 'StudentsApplicationStatus', 
        Key: {
            'applicationId': applicationId  
        },
        UpdateExpression: 'set applicationStatus = :s',  
        ExpressionAttributeValues: {
            ':s': status
        },
        ReturnValues: "UPDATED_NEW"  
    };

    try {
        await dynamoDB.update(params).promise();
        return { statusCode: 200, body: "Updated Succesfully." };  
    } catch (error) {
        console.error('Error in DynamoDB operation:', error);
        return { statusCode: 500, body: "Error occurred while updating"};
    }
};



module.exports = { updateStudentApplicationStatus };
