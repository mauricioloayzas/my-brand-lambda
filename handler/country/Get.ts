import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import {CountryDTO} from "./dtos/CountryDTO";

// Create DynamoDB document client
const dynamoDb = new DynamoDB.DocumentClient();

export const getCountry: APIGatewayProxyHandler = async (event) => {
  try {
    const id = Number(event.pathParameters?.id);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid ID' }),
      };
    }

    const params = {
      TableName: 'Countries',
      Key: { id },
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Country not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error: any) {
    console.error('Error getting country:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not retrieve country' + error.message }),
    };
  }
};