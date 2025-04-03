import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import {CountryDTO} from "./dtos/CountryDTO";
import getNextId from "../../services/database/getNextId";

// Create DynamoDB document client
const dynamoDb = new DynamoDB.DocumentClient();
const tableName: string = "Countries";
export const CreateCountry: APIGatewayProxyHandler = async (event) => {
  const body: any = JSON.parse(event.body || '{}');

  // Validate input data
  if (!body.name || typeof body.name !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid input: name must be a string' }),
    };
  }

  const newId: number = await getNextId(tableName);
  // Create DTO object
  const country: CountryDTO = {
    id: newId,
    name: body.name,
  };

  const params = {
    TableName: tableName, // DynamoDB table name
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
