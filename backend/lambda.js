import { DynamoDBClient, DescribeTableCommand, CreateTableCommand, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; // Import SES from AWS SDK

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const ses = new SESClient({ region: 'us-east-2' }); // Initialize SES client

const TABLE_NAME = 'PersonalData';

// Define the valid tokens
const GET_TOKEN = "coursecloudcomputingfinalproject";
const PUT_POST_TOKEN = "coursecloudcomputingfinalprojectupdate";

export const handler = async (event) => {
    let response;

    try {
        // Ensure the table exists before proceeding
        await ensureTableExists();

        // Check the authorization token
        const authToken = event.headers.Authorization || event.headers.authorization;

        if (!authToken) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: "Forbidden: No Authorization token provided" }),
                  headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
            };
        }

        // Determine the operation based on the HTTP method and the token provided
        const routeKey = `${event.httpMethod} ${event.resource}`;
        switch (routeKey) {
            case 'GET /personal':
            case 'GET /aboutme':
            case 'GET /skills':
            case 'GET /professional':
                if (authToken !== GET_TOKEN) {
                    return {
                        statusCode: 403,
                        body: JSON.stringify({ message: "Forbidden: Invalid GET token" }),
                    };
                }
                response = await handleGetRequest(routeKey);
                break;

            case 'PUT /personal':
            case 'PUT /aboutme':
            case 'PUT /skills':
            case 'PUT /professional':
            case 'POST /personal':
            case 'POST /aboutme':
            case 'POST /skills':
            case 'POST /professional':
                if (authToken !== PUT_POST_TOKEN) {
                    return {
                        statusCode: 403,
                        body: JSON.stringify({ message: "Forbidden: Invalid PUT/POST token" }),
                          headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
                    };
                }
                response = await handlePutOrPostRequest(routeKey, JSON.parse(event.body));
                break;
            // New route for sending email
            case 'POST /sendemail':
                // Ensure the request body is parsed correctly
                if (authToken !== PUT_POST_TOKEN) {
                    return {
                        statusCode: 403,
                        body: JSON.stringify({ message: "Forbidden: Invalid PUT/POST token" }),
                          headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
                    };
                }
                const emailData = JSON.parse(event.body);
                response = await sendEmailNotification(emailData);
                break;
            default:
                response = {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Route not found" }),
                      headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
                };
                break;
        }
    } catch (error) {
        console.error("Error processing request:", error);  // Log the full error
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: error.message || "Internal Server Error", error, general: "hereeer" }),
              headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    }

    return response;
};
// Function to send email notification via AWS SES
const sendEmailNotification = async (data) => {
    

    try {
        const params = {
            Destination: {
                ToAddresses: ["cesarwilly.mc@gmail.com"], // Recipient email address
            },
            Message: {
                Body: {
                    Text: { Data: `Message from ${data.name} (${data.email}, ${data.phone})\n\nTitle: ${data.messageTitle}\n\nMessage:\n${data.message}` }, // Email content
                },
                Subject: { Data: `New contact form submission: ${data.messageTitle}` }, // Email subject
            },
            Source: 'cesarwilly.mc@gmail.com', // Must be a verified SES email
        };
        const command = new SendEmailCommand(params);
        await ses.send(command);
        console.log("Email sent successfully.");

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully!" }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to send email", error: error.message }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    }
};
// Ensure the table exists, and create it if it doesn't
const ensureTableExists = async () => {
    try {
        const describeTableCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
        await dynamodb.send(describeTableCommand);
        console.log(`Table "${TABLE_NAME}" already exists.`);
    } catch (error) {
        if (error.name === 'ResourceNotFoundException') {
            console.log(`Table "${TABLE_NAME}" not found. Creating it now...`);
            await createTable();
        } else {
            throw error;
        }
    }
};

// Function to create the DynamoDB table
const createTable = async () => {
    const createTableCommand = new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [
            { AttributeName: "type", KeyType: "HASH" }, // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "type", AttributeType: "S" }, // Attribute type is String
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
    });

    await dynamodb.send(createTableCommand);

    console.log(`Table "${TABLE_NAME}" created successfully.`);
};

// Function to handle GET requests
const handleGetRequest = async (routeKey) => {
    let type;
    switch (routeKey) {
        case 'GET /personal':
            type = 'personalData';
            break;
        case 'GET /aboutme':
            type = 'aboutMe';
            break;
        case 'GET /skills':
            type = 'skills';
            break;
        case 'GET /professional':
            type = 'professionalData';
            break;
    }
    return await getItem(type);
};

// Function to handle PUT or POST requests
const handlePutOrPostRequest = async (routeKey, data) => {
    let type;
    switch (routeKey) {
        case 'PUT /personal':
        case 'POST /personal':
            type = 'personalData';
            break;
        case 'PUT /aboutme':
        case 'POST /aboutme':
            type = 'aboutMe';
            break;
        case 'PUT /skills':
        case 'POST /skills':
            type = 'skills';
            break;
        case 'PUT /professional':
        case 'POST /professional':
            type = 'professionalData';
            break;
    }
    if (routeKey.startsWith('POST')) {
        return await createItem(type, data);
    } else {
        return await updateItem(type, data);
    }
};

// Function to get an item from DynamoDB
const getItem = async (type) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            "type": { S: type },
        },
    };

    try {
        const command = new GetItemCommand(params);
        const result = await dynamodb.send(command);

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: `${type} not found` }),
            };
        }

        const item = {
            type: result.Item.type.S,
            ...result.Item
        };

        // Convert lists and maps back from DynamoDB format
        if(item.name) item.name = item.name.S;
        if(item.role) item.role = item.role.S;
        if(item.title) item.title = item.title.S;
        if (item.education) item.education = item.education.L.map(e => e.S);
        if (item.contactLinks) item.contactLinks = item.contactLinks.L.map(link => link.S);
        if (item.body) item.body = item.body.L.map(b => b.S);
        if (item.soft) item.soft = item.soft.L.map(skill => ({ icon: skill.M.icon.S, text: skill.M.text.S }));
        if (item.hard) item.hard = item.hard.L.map(skill => ({ icon: skill.M.icon.S, text: skill.M.text.S }));
        if (item.experiences) {
            item.experiences = item.experiences.L.map(exp => ({
                role: exp.M.role.S,
                description: exp.M.description.S,
                current: exp.M.current.BOOL
            }));
        }

        return {
            statusCode: 200,
            body: JSON.stringify(item),
              headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    } catch (error) {
        console.error(`Error getting ${type}:`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error getting ${type}`, error: error.message }),
              headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    }
};

// Function to create an item in DynamoDB (POST)
const createItem = async (type, data) => {
    const item = {
        "type": { S: type },
    };

    if (type === 'personalData') {
        item.name = { S: data.name };
        item.role = { S: data.role };
        item.education = { L: data.education.map(e => ({ S: e })) };
        item.contactLinks = { L: data.contactLinks.map(link => ({ S: link })) };
    } else if (type === 'aboutMe') {
        item.title = { S: data.title };
        item.body = { L: data.body.map(b => ({ S: b })) };
    } else if (type === 'skills') {
        item.soft = {
            L: data.soft.map(skill => ({
                M: {
                    icon: { S: skill.icon },
                    text: { S: skill.text }
                }
            }))
        };
        item.hard = {
            L: data.hard.map(skill => ({
                M: {
                    icon: { S: skill.icon },
                    text: { S: skill.text }
                }
            }))
        };
    } else if (type === 'professionalData') {
        item.title = { S: data.title };
        item.experiences = {
            L: data.experiences.map(exp => ({
                M: {
                    role: { S: exp.role },
                    description: { S: exp.description },
                    current: { BOOL: exp.current }
                }
            }))
        };
    }

    const params = {
        TableName: TABLE_NAME,
        Item: item,
    };

    try {
        const command = new PutItemCommand(params);
        await dynamodb.send(command);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: `${type} created successfully` }),
              headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    } catch (error) {
        console.error(`Error creating ${type}:`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error creating ${type}`, error: error.message }),
              headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins, or specify a specific origin
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
        };
    }
};

// Function to update an item in DynamoDB (PUT)
const updateItem = async (type, data) => {
    return await createItem(type, data);  // Reuse createItem logic since it overwrites the item
};
