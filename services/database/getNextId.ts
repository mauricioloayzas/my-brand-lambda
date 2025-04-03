import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

async function getNextId(tableName: string): Promise<number> {
  const counterParams = {
    TableName: 'Counters',
    Key: { counterName: tableName },
    UpdateExpression: 'SET currentValue = if_not_exists(currentValue, :start) + :incr',
    ExpressionAttributeValues: {
      ':start': 0,
      ':incr': 1
    },
    ReturnValues: 'UPDATED_NEW'
  };

  const result = await dynamoDb.update(counterParams).promise();
  return result.Attributes?.currentValue ?? 1;
}

export default getNextId;