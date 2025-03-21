import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const GetAllCountries: APIGatewayProxyHandler = async () => {
  try {
    const params = {
      TableName: 'Countries',
    };

    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ countries: result.Items }),
    };
  } catch (error) {
    console.error('Error listing countries:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not retrieve countries' }),
    };
  }
};