import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import {CountryDTO} from "./dtos/CountryDTO";

// Create DynamoDB document client
const dynamoDb = new DynamoDB.DocumentClient();

export const CreateCountry: APIGatewayProxyHandler = async (event) => {
  const body: any = JSON.parse(event.body || '{}');

  // Validate input data
  if (!body.id || !body.name || typeof body.id !== 'number') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input: id must be a number and name is required' }),
    };
  }

  // Create DTO object
  const country: CountryDTO = {
    id: body.id,
    name: body.name,
  };

  const params = {
    TableName: 'Countries', // DynamoDB table name
    Item: country,
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Country saved successfully', country: country }),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not save country '+ error.message }),
    };
  }
};
