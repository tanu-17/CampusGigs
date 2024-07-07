// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const QueueUrl = 'https://sqs.us-east-2.amazonaws.com/590183759152/alert-messaging-queue';
const sendMessageToSQS = async (body,jobData) => {
    const subject = `Application status for ${jobData.jobTitle}`;
    const message = body.status === "awaitingResponse" ? `You've been selected for ${jobData.jobTitle}.` : `You got rejected for ${jobData.jobTitle}. Login to On-Campus job portal to know more.` ;
    const params = {
        // Replace 'QUEUE_URL' with your queue's URL
        QueueUrl,
        MessageBody: JSON.stringify({subject,message,source: "updateApplicationStatus"})
    };
    
    try {
        const data = await sqs.sendMessage(params).promise();
        console.log("Success", data.MessageId);
        return data;
    } catch (err) {
        console.error("Error", err);
        throw err;
    }
};


module.exports = { sendMessageToSQS };