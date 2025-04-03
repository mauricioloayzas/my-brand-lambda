import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { CountryDTO } from "./dtos/CountryDTO";

// Create DynamoDB document client
const dynamoDb = new DynamoDB.DocumentClient();

export const editCountry: APIGatewayProxyHandler = async (event) => {
  try {
    const id = Number(event.pathParameters?.id);

    if (isNaN(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid ID" }),
      };
    }

    const body: any = JSON.parse(event.body || '{}');

    // Validate input data
    if (!body.name || typeof body.name !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input: name must be a string' }),
      };
    }

    const params = {
      TableName: "Countries",
      Key: { id },
    };

    return dynamoDb.get(params).promise().then((result) => {
      if (!result.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Country not found" }),
        };
      }

      const country: CountryDTO = {
        id: result.Item.id,
        name: body.name,
      };

      return {
        statusCode: 200,
        body: JSON.stringify(country),
      };
    });
  } catch (error: any) {
    console.error("Error getting country:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not retrieve country: " + error.message }),
    };
  }
};
