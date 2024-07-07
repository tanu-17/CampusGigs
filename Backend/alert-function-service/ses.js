const AWS = require('aws-sdk');

const emails = ["dinegi@syr.edu","trana01@syr.edu"]
// Initialize AWS Services
//const dynamoDB = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name and SNS topic ARN
const DYNAMODB_TABLE_NAME = 'Students';
// Initialize SES instead of SNS
const ses = new AWS.SES({
    region: 'us-east-2' // Make sure to specify your region
});

const sendJobAlert = async (event) => {
    // Iterate over each record if the Lambda is triggered by SQS
    for (const record of event.Records) {
        const {subject,message} = record.body &&  typeof(record.body) === "string" ? JSON.parse(record.body) : record.body;
        console.log('Processing job posting:', {subject,message});

        // Extract emails from DynamoDB
        //const emails = await getStudentEmails(jobPosting);
        await sendNotifications([emails[0]], subject,message);
        
        return{
            statusCode : 200
        };
    }
};

// // Function to retrieve student emails from DynamoDB
// const getStudentEmails = async (jobPosting) => {
//     let params = {
//         TableName: DYNAMODB_TABLE_NAME,
//     };
//     if (jobPosting.jobAppliedStudentSuid) {
//         // Setting up parameters for querying by `suid`
//         params.KeyConditionExpression = "suid = :suid";
//         params.ExpressionAttributeValues = {
//             ":suid": jobPosting.jobAppliedStudentSuid
//         };

//     try {
//         const data = await dynamoDB.scan(params).promise();
//         // Extracting emails from the records
//         const emails = data.Items.filter(item => item.isEmailVerified).map(item => item.email);
//         return emails;
//     } catch (error) {
//         console.error("Error fetching student emails from DynamoDB:", error);
//         throw new Error('Error fetching student emails');
//     }
//     }
// };


// Modified sendNotifications function to use SES
const sendNotifications = async (emails, subject,message) => {
    // Ensure 'Source' is your verified email address
    const params = {
        Source: 'dishanegi.dn@gmail.com', // Replace with your verified SES email address
        Message: {
            Subject: { Data: `New job posting: ${subject}` },
            Body: {
                Text: { Data: `Details: ${message}` }
            }
        }
    };

    const emailPromises = emails.map(email => {
        const individualParams = { ...params, Destination: { ToAddresses: [email] } };
        return ses.sendEmail(individualParams).promise().then(() => {
            console.log(`Notification sent to: ${email}`);
        }).catch(error => {
            console.error(`Error sending notification to ${email}:`, error);
        });
    });

    try {
        // Wait for all email sending operations to settle
        await Promise.allSettled(emailPromises);
    } catch (error) {
        console.error("Error sending notifications via SES:", error);
    }
};



module.exports = { sendJobAlert };